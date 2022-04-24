import type Resource from '../resource';
import WritableModel, { WritableModelCreationOptions } from '../../base/writable-model';
import EncodingType from '../../enums/encoding-type';
import { bufferContainsXml } from '../../common/helpers';
import { CompressedBuffer, CompressionType } from '@s4tk/compression';

/**  Optional arguments for initializing RawResources. */
interface RawResourceCreationOptions extends
  Omit<WritableModelCreationOptions, "initialBufferCache" | "saveBuffer">,
  Partial<{
    /** Why this resource is loaded raw. Used for debugging. */
    reason: string;
  }> { };

/**
 * Model for resources that have not been parsed and cannot be modified.
 */
export default class RawResource extends WritableModel implements Resource {
  readonly encodingType: EncodingType = EncodingType.Unknown;
  /** Why this resource was loaded raw. */
  readonly reason?: string;

  /** Shorthand for `this.getBuffer()`, since a raw buffer will never change. */
  get buffer(): Buffer { return this.getBuffer(); }

  //#region Initialization

  /**
   * Creates a new RawResource from the given buffer wrapper and options.
   * 
   * @param bufferWrapper The CompressedBuffer wrapper for this resource's buffer.
   * @param options Object containing optional arguments.
   */
  constructor(bufferWrapper: CompressedBuffer, options?: RawResourceCreationOptions) {
    super(Object.assign({
      initialBufferCache: bufferWrapper,
      saveBuffer: true,
    }, options));

    this.reason = options?.reason;
  }

  /**
   * Creates a new RawResource from the given buffer. The buffer is assumed to
   * be uncompressed; passing in a compressed buffer can lead to unexpected
   * behavior.
   * 
   * @param buffer The decompressed buffer for this RawResource
   * @param options Object containing optional arguments
   */
  static from(buffer: Buffer, options?: RawResourceCreationOptions): RawResource {
    return new RawResource({
      buffer,
      compressionType: CompressionType.Uncompressed,
      sizeDecompressed: buffer.byteLength
    }, options);
  }

  //#endregion Initialization

  //#region Public Methods

  clone(): RawResource {
    return new RawResource(this._getBufferCache(), {
      defaultCompressionType: this.defaultCompressionType,
      reason: this.reason,
      owner: this.owner
    });
  }

  equals(other: RawResource): boolean {
    return other && (this.buffer.compare(other.buffer) === 0);
  }

  isXml(): boolean {
    return bufferContainsXml(this.buffer);
  }

  onChange() {
    // intentionally blank
  }

  //#endregion Public Methods

  //#region Protected Methods

  protected _clearBufferCacheIfSupported(): void {
    // intentionally blank
  }

  protected _serialize(): Buffer {
    throw new Error("Cannot serialize a raw resource. If you're reading this error, the cached buffer in a raw resource somehow got deleted, which should be impossible. Please report this error ASAP: https://github.com/sims4toolkit/models/issues");
  }

  //#endregion Protected Methods
}
