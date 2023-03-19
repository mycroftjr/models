import { CompressionType, CompressedBuffer, compressBuffer, decompressBuffer } from "@s4tk/compression";
import ApiModelBase from "./api-model";
import { promisify } from "../common/helpers";
import { BinaryFileReadingOptions } from "../common/options";

/**
 * Optional arguments for creating WritableModels.
 */
export type WritableModelCreationOptions = Partial<{
  /**
   * How this model's buffer should be compressed by default. If not supplied,
   * then `CompressionType.ZLIB` is assumed.
   */
  defaultCompressionType: CompressionType;

  /**
   * The initial buffer to save on this model.
   */
  initialBufferCache: CompressedBuffer;

  /**
   * The model that contains this one. The owner is notified whenever the child
   * model is changed, and will uncache its buffer.
   */
  owner: ApiModelBase;
}>;

/**
 * Optional arguments for creating WritableModels with their `from()` methods.
 */
export interface WritableModelFromOptions extends
  WritableModelCreationOptions,
  BinaryFileReadingOptions { }

/**
 * Base class for models that can be written to disk.
 */
export default abstract class WritableModel extends ApiModelBase {
  //#region Properties

  protected _bufferCache?: CompressedBuffer;
  private _defaultCompressionType: CompressionType;

  /** The current buffer cache, if there is any. */
  get bufferCache(): CompressedBuffer {
    return this._bufferCache;
  }

  /**
   * How this model's buffer should be compressed by default. This is not
   * necessarily the same as the compression type of the current buffer cache.
   */
  get defaultCompressionType(): CompressionType { return this._defaultCompressionType; }
  set defaultCompressionType(value: CompressionType) {
    if (this._bufferCache && (this._bufferCache.compressionType !== value)) {
      this._clearBufferCacheIfSupported();
    }

    this._defaultCompressionType = value ?? CompressionType.Uncompressed;
  }

  /** Whether this model currently has a cached buffer. */
  get hasBufferCache(): boolean {
    // intentionally != so that null is captured
    return this._bufferCache != undefined;
  }

  //#endregion Properties

  //#region Initialization

  protected constructor(options?: WritableModelCreationOptions) {
    super(options?.owner);
    this._defaultCompressionType = options?.defaultCompressionType ?? CompressionType.ZLIB;
    if (options?.initialBufferCache) this._bufferCache = options.initialBufferCache;
  }

  //#endregion Initialization

  //#region Public Methods

  /**
   * Returns an uncompressed buffer for this model. If an uncompressed buffer is
   * available in the cache, it will be returned.
   * 
   * @param cache Whether or not the buffer that is returned by this method
   * should be cached. If the buffer is already cached, it will not be deleted
   * if this argument is false. False by default.
   * @param minify Whether or not to minify the output buffer, if possible. Not
   * all models can be minified. False by default.
   */
  getBuffer(cache = false, minify = false): Buffer {
    let decompressedBuffer: Buffer;

    if (this._bufferCache) {
      const { buffer, compressionType } = this._bufferCache;

      if (compressionType === CompressionType.Uncompressed) {
        return buffer;
      } else {
        decompressedBuffer = decompressBuffer(buffer, compressionType);
      }
    } else {
      decompressedBuffer = this._serialize(minify);
    }

    // at this point, there either is no cache or the cache isn't uncompressed, so overwrite it
    if (cache) {
      this._bufferCache = {
        buffer: decompressedBuffer,
        sizeDecompressed: decompressedBuffer.byteLength,
        compressionType: CompressionType.Uncompressed
      };
    }

    return decompressedBuffer;
  }

  /**
   * Asynchronously returns an uncompressed buffer for this model. If an
   * uncompressed buffer is available in the cache, it will be returned.
   * 
   * @param cache Whether or not the buffer that is returned by this method
   * should be cached. If the buffer is already cached, it will not be deleted
   * if this argument is false. False by default.
   * @param minify Whether or not to minify the output buffer, if possible. Not
   * all models can be minified. False by default.
   */
  async getBufferAsync(cache?: boolean, minify?: boolean): Promise<Buffer> {
    return promisify(() => this.getBuffer(cache, minify));
  }

  /**
   * Returns a wrapper for the compressed buffer for this model. If a buffer in
   * the correct compression format is cached on this model, it will be
   * returned.
   * 
   * @param targetCompressionType How the buffer should be compressed. If not
   * given, the default compression type for this model is used.
   * @param cache Whether or not the buffer that is returned by this method
   * should be cached. If the buffer is already cached, it will not be deleted
   * if this argument is false. False by default.
   * @param minify Whether or not to minify the output buffer, if possible. Not
   * all models can be minified. False by default.
   */
  getCompressedBuffer(
    targetCompressionType = this.defaultCompressionType,
    cache = false,
    minify = false
  ): CompressedBuffer {
    let decompressedBuffer: Buffer;

    if (this._bufferCache) {
      const { buffer, compressionType } = this._bufferCache;

      if (compressionType === targetCompressionType) {
        return this._bufferCache;
      } else {
        decompressedBuffer = decompressBuffer(buffer, compressionType);
      }
    } else {
      decompressedBuffer = this._serialize(minify);
    }

    const wrapper: CompressedBuffer = {
      buffer: compressBuffer(decompressedBuffer, targetCompressionType),
      sizeDecompressed: decompressedBuffer.byteLength,
      compressionType: targetCompressionType
    };

    if (cache) this._bufferCache = wrapper;

    return wrapper;
  }

  /**
   * Generates a wrapper for the compressed buffer for this model
   * asynchronously, and returns it in a Promise. If a buffer in the correct
   * compression format is available on this model, it will be returned.
   * 
   * @param targetCompressionType How the buffer should be compressed. If not
   * given, the default compression type for this model is used.
   * @param cache Whether or not the buffer that is returned by this method
   * should be cached. If the buffer is already cached, it will not be deleted
   * if this argument is false. False by default.
   * @param minify Whether or not to minify the output buffer, if possible. Not
   * all models can be minified. False by default.
   */
  async getCompressedBufferAsync(
    targetCompressionType?: CompressionType,
    cache?: boolean,
    minify?: boolean
  ): Promise<CompressedBuffer> {
    return promisify(() => this.getCompressedBuffer(targetCompressionType, cache, minify));
  }

  onChange() {
    this._clearBufferCacheIfSupported();
    super.onChange();
  }

  //#endregion Public Methods

  //#region Protected Methods

  /**
   * Clears this model's cache, if it is able to. Subclasses for which the cache
   * cannot be cleared must override this method and NOT call super.
   */
  protected _clearBufferCacheIfSupported() {
    delete this._bufferCache;
  }

  /**
   * Returns a newly serialized, decompressed buffer for this model.
   * 
   * @param minify Whether or not the output buffer should be minified
   */
  protected abstract _serialize(minify?: boolean): Buffer;

  //#endregion Protected Methods
}
