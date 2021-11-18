import Resource from './Resource';
import type { ResourceVariant } from './Resource';

/**
 * Model for resource types that may or may not be supported, but have
 * intentionally not been parsed any further than their raw buffer.
 */
export default class RawResource extends Resource {
  readonly variant: ResourceVariant = 'RAW';
  private _encoding: BufferEncoding;
  private _content?: string;

  private constructor(buffer: Buffer, encoding: BufferEncoding) {
    super(buffer);
    this._encoding = encoding;
  }

  /**
   * Returns this resource in plain text form.
   */
  plainText(): string {
    if (this._content === undefined)
      this._content = this.getBuffer().toString(this._encoding);
    return this._content;
  }

  /**
   * Creates a new raw resource from the given buffer, and reads it in the given
   * encoding (UTF-8 if not provided). Reading the buffer is done lazily, it
   * will not actually be decoded until `plainText()` is called.
   * 
   * @param buffer Buffer to create a raw resource from
   * @param encoding How the buffer is encoded
   */
  static from(buffer: Buffer, encoding: BufferEncoding = 'utf-8'): RawResource {
    return new RawResource(buffer, encoding);
  }

  protected _serialize(): Buffer {
    throw new Error("Cannot serialize a raw resource.");
  }
}
