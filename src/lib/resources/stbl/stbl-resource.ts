import { fnv32 } from "@s4tk/hashing";
import { CompressedBuffer, CompressionType } from "@s4tk/compression";
import type { KeyStringPair } from "./types";
import { PrimitiveMappedModel } from "../../base/primitive-mapped-model";
import Resource from "../resource";
import { arraysAreEqual, promisify } from "../../common/helpers";
import readStbl from "./serialization/read-stbl";
import writeStbl from "./serialization/write-stbl";
import EncodingType from "../../enums/encoding-type";
import StringEntry from "./string-entry";
import { WritableModelCreationOptions, WritableModelFromOptions } from "../../base/writable-model";
import ResourceRegistry from "../../packages/resource-registry";
import BinaryResourceType from "../../enums/binary-resources";
import { formatStringKey } from "@s4tk/hashing/formatting";

/**
 * Model for string table (STBL) resources.
 */
export default class StringTableResource extends PrimitiveMappedModel<string, StringEntry> implements Resource {
  readonly encodingType: EncodingType = EncodingType.STBL;

  //#region Initialization

  /**
   * Creates a new STBL resource from the given entries.
   * 
   * @param entries Entries to initialize the STBL model with
   * @param options Object of options
   */
  constructor(entries?: KeyStringPair[], options?: WritableModelCreationOptions) {
    super(entries, options);
  }

  /**
   * Creates a STBL resource from a buffer containing binary data. This buffer
   * is assumed to be uncompressed; providing a compressed buffer will lead to
   * unexpected behavior.
   * 
   * @param buffer Uncompressed buffer to read as a string table
   * @param options Object of options
   */
  static from(buffer: Buffer, options?: WritableModelFromOptions): StringTableResource {
    let initialBufferCache: CompressedBuffer;
    if (options?.saveBuffer) initialBufferCache = options?.initialBufferCache ?? {
      buffer,
      compressionType: CompressionType.Uncompressed,
      sizeDecompressed: buffer.byteLength
    };

    return new StringTableResource(readStbl(buffer, options), {
      defaultCompressionType: options?.defaultCompressionType,
      owner: options?.owner,
      initialBufferCache
    });
  }

  /**
   * Asynchronously creates a STBL resource from a buffer containing binary
   * data. This buffer is assumed to be uncompressed; providing a compressed
   * buffer will lead to unexpected behavior.
   * 
   * @param buffer Buffer to read as a string table
   * @param options Object of options
   */
  static async fromAsync(buffer: Buffer, options?: WritableModelFromOptions): Promise<StringTableResource> {
    return promisify(() => StringTableResource.from(buffer, options));
  }

  //#endregion Initialization

  //#region Public Methods

  /**
   * Creates a new entry from the given string, adds it to the string table,
   * and returns it. If `toHash` is supplied, it will be hashed for the key. If
   * not, then the string itself will be hashed.
   * 
   * To ensure that strings are not duplicated, consider using the following:
   * ```ts
   * stbl.getByValue(stringToAdd) ?? stbl.addAndHash(stringToAdd)
   * ```
   * 
   * @param value String to add to table
   * @param toHash Optional string to hash for the key
   * @returns The entry object that was created
   */
  addAndHash(value: string, toHash?: string): StringEntry {
    const key = fnv32(toHash ? toHash : value);
    return this.add(key, value);
  }

  clone(): StringTableResource {
    return new StringTableResource(this.entries, {
      defaultCompressionType: this.defaultCompressionType,
      initialBufferCache: this.bufferCache
    });
  }

  equals(other: StringTableResource): boolean {
    return arraysAreEqual(this.entries, other?.entries);
  }

  isXml(): boolean {
    return false;
  }

  /**
   * Returns a list of entries for this STBL for writing to a JSON.
   * 
   * @param useHexKey Whether or not the key should be written as a hex string,
   * true by default
   * @param useId Whether or not to add a unique ID to each entry, false by
   * default
   */
  toJsonObject(useHexKey = true, useId = false): {
    key: string | number;
    value: string;
    id?: number;
  }[] {
    return this.entries.map(({ id, key, value }) => {
      const result: any = {
        key: useHexKey ? formatStringKey(key) : key,
        value
      };

      if (useId) result.id = id;

      return result
    });
  }

  //#endregion Public Methods

  //#region Protected Methods

  protected _makeEntry(key: number, value: string): StringEntry {
    return new StringEntry(key, value, this);
  }

  protected _serialize(): Buffer {
    return writeStbl(this.entries);
  }

  //#region Protected Methods
}

ResourceRegistry.registerTypes(
  StringTableResource,
  BinaryResourceType.StringTable
);
