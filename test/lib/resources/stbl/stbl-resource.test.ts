import * as fs from "fs";
import * as path from "path";
import { expect } from "chai";
import { fnv32 } from "@s4tk/hashing";
import { StringTableResource } from "../../../../dst/models";
import MockOwner from "../../../mocks/mock-owner";
import { EncodingType } from "../../../../dst/enums";
import { CompressedBuffer, CompressionType } from "@s4tk/compression";

//#region Helpers

const cachedBuffers: { [key: string]: Buffer; } = {};

function getBuffer(filename: string): Buffer {
  if (!cachedBuffers[filename]) {
    const filepath = path.resolve(__dirname, `../../../data/stbls/${filename}.stbl`);
    cachedBuffers[filename] = fs.readFileSync(filepath);
  }

  return cachedBuffers[filename];
}

function getStbl(filename: string, saveBuffer = false): StringTableResource {
  return StringTableResource.from(getBuffer(filename), { saveBuffer });
}

//#endregion Helpers

describe("StringTableResource", () => {
  //#region Properties

  describe("#entries", () => {
    it("should return the entries in an array", () => {
      const stbl = getStbl("Normal");
      expect(stbl.entries).to.be.an('Array').with.lengthOf(3);
      const [first, second, third] = stbl.entries;
      expect(first.key).to.equal(0x7E08629A);
      expect(first.value).to.equal("This is a string.");
      expect(second.key).to.equal(0xF098F4B5);
      expect(second.value).to.equal("This is another string!");
      expect(third.key).to.equal(0x8D6D117D);
      expect(third.value).to.equal("And this, this is a third.");
    });

    it("should not mutate the internal map", () => {
      const stbl = getStbl("Normal");
      const entries = stbl.entries;
      expect(stbl.size).to.equal(3);
      entries.splice(0, 1);
      expect(stbl.size).to.equal(3);
      expect(stbl.get(0).key).to.equal(0x7E08629A);
    });

    it("should not uncache the model when mutated", () => {
      const stbl = getStbl("Normal", true);
      expect(stbl.hasBufferCache).to.be.true;
      const entries = stbl.entries;
      entries.splice(0, 1);
      expect(stbl.hasBufferCache).to.be.true;
    });

    it("should be the same object when accessed more than once without changes", () => {
      const stbl = getStbl("Normal");
      const entries = stbl.entries;
      expect(stbl.entries).to.equal(entries);
    });

    it("should be a new object when an entry is added", () => {
      const stbl = getStbl("Normal");
      const entries = stbl.entries;
      stbl.add(2468, "ciao");
      expect(stbl.entries).to.not.equal(entries);
    });

    it("should be a new object when an entry is mutated", () => {
      const stbl = getStbl("Normal");
      const entries = stbl.entries;
      entries[0].key = 2468;
      expect(stbl.entries).to.not.equal(entries);
    });

    it("should be a new object when an entry is removed", () => {
      const stbl = getStbl("Normal");
      const entries = stbl.entries;
      stbl.delete(0);
      expect(stbl.entries).to.not.equal(entries);
    });
  });

  describe("#size", () => {
    it("should return 0 when the stbl is empty", () => {
      const stbl = new StringTableResource();
      expect(stbl.size).to.equal(0);
    });

    it("should return the number of entries in the stbl", () => {
      const stbl = getStbl("Normal");
      expect(stbl.size).to.equal(3);
    });

    it("should increase by 1 after adding an entry", () => {
      const stbl = getStbl("Normal");
      expect(stbl.size).to.equal(3);
      stbl.addAndHash("hello");
      expect(stbl.size).to.equal(4);
    });

    it("should decrease by 1 after deleting an entry", () => {
      const stbl = getStbl("Normal");
      expect(stbl.size).to.equal(3);
      stbl.delete(0);
      expect(stbl.size).to.equal(2);
    });
  });

  describe("#encodingType", () => {
    it("should be STBL", () => {
      const stbl = getStbl("Normal");
      expect(stbl.encodingType).to.equal(EncodingType.STBL);
    });
  });

  //#endregion Properties

  //#region Initialization

  describe("#constructor", () => {
    it("should create an empty stbl when given nothing", () => {
      const stbl = new StringTableResource();
      expect(stbl.entries).to.be.an('Array').that.is.empty;
    });

    it("should create an empty stbl when given an empty array", () => {
      const stbl = new StringTableResource([]);
      expect(stbl.entries).to.be.an('Array').that.is.empty;
    });

    it("should create an empty stbl when given null", () => {
      const stbl = new StringTableResource(undefined);
      expect(stbl.entries).to.be.an('Array').that.is.empty;
    });

    it("should use the entries that are given", () => {
      const stbl = new StringTableResource([
        { key: 123, value: "First" },
        { key: 456, value: "Second" }
      ]);

      expect(stbl.entries).to.be.an('Array').with.lengthOf(2);
      expect(stbl.entries[0].key).to.equal(123);
      expect(stbl.entries[0].string).to.equal("First");
      expect(stbl.entries[1].key).to.equal(456);
      expect(stbl.entries[1].string).to.equal("Second");
    });

    it("should use the given owner", () => {
      const owner = new MockOwner();
      const stbl = new StringTableResource(undefined, { owner });
      expect(stbl.owner).to.equal(owner);
    });

    it("should not have an owner if not given", () => {
      const stbl = new StringTableResource();
      expect(stbl.owner).to.be.undefined;
    });

    it("should use the given defaultCompressionType", () => {
      const stbl = new StringTableResource(undefined, {
        defaultCompressionType: CompressionType.InternalCompression
      });

      expect(stbl.defaultCompressionType).to.equal(CompressionType.InternalCompression);
    });

    it("should use defaultCompressionType of ZLIB if not given", () => {
      const stbl = new StringTableResource();
      expect(stbl.defaultCompressionType).to.equal(CompressionType.ZLIB);
    });

    it("should use the given initialBufferCache", () => {
      const buffer = getBuffer("Normal");
      const initialBufferCache: CompressedBuffer = {
        buffer,
        compressionType: CompressionType.Uncompressed,
        sizeDecompressed: buffer.byteLength
      };
      const stbl = new StringTableResource(undefined, { initialBufferCache });
      expect(stbl.hasBufferCache).to.be.true;
      expect(stbl.getCompressedBuffer(CompressionType.Uncompressed)).to.equal(initialBufferCache);
    });

    it("should not be cached if initialBufferCache not given", () => {
      const stbl = new StringTableResource();
      expect(stbl.hasBufferCache).to.be.false;
    });

    it("should assign IDs to the entries that are created", () => {
      const stbl = new StringTableResource([
        { key: 123, value: "First" },
        { key: 456, value: "Second" }
      ]);

      expect(stbl.entries[0].id).to.equal(0);
      expect(stbl.entries[1].id).to.equal(1);
    });
  });

  describe("static#from()", () => {
    context("stbl content is valid", () => {
      it("should be cached if saveBuffer = true", () => {
        const stbl = StringTableResource.from(getBuffer("Normal"), { saveBuffer: true });
        expect(stbl.hasBufferCache).to.be.true;
      });

      it("should not be cached if saveBuffer = false", () => {
        const stbl = StringTableResource.from(getBuffer("Normal"), { saveBuffer: false });
        expect(stbl.hasBufferCache).to.be.false;
      });

      it("should not be cached by default", () => {
        const stbl = StringTableResource.from(getBuffer("Normal"));
        expect(stbl.hasBufferCache).to.be.false;
      });

      it("should read empty stbl", () => {
        const stbl = StringTableResource.from(getBuffer("Empty"));
        expect(stbl.size).to.equal(0);
      });

      it("should read stbl with entries", () => {
        const stbl = StringTableResource.from(getBuffer("Normal"));
        expect(stbl.size).to.equal(3);
        const [first, second, third] = stbl.entries;
        expect(first.key).to.equal(0x7E08629A);
        expect(first.value).to.equal("This is a string.");
        expect(second.key).to.equal(0xF098F4B5);
        expect(second.value).to.equal("This is another string!");
        expect(third.key).to.equal(0x8D6D117D);
        expect(third.value).to.equal("And this, this is a third.");
      });

      it("should read stbl with special characters", () => {
        const stbl = StringTableResource.from(getBuffer("SpecialChars"));
        expect(stbl.size).to.equal(4);
        expect(stbl.get(3).value).to.equal("Thís iš å strįñg w/ spêçiāl chars.");
      });

      it("should load identical entries as their own objects", () => {
        const stbl = StringTableResource.from(getBuffer("RepeatedStrings"));
        expect(stbl.size).to.equal(6);
        const [first, second, third, fourth, fifth, sixth] = stbl.entries;

        expect(first).to.not.equal(second);
        expect(first.equals(second)).to.be.true;

        expect(third).to.not.equal(fourth);
        expect(third.key).to.not.equal(fourth.key);
        expect(third.value).to.equal(fourth.value);

        expect(fifth).to.not.equal(sixth);
        expect(fifth.key).to.equal(sixth.key);
        expect(fifth.value).to.not.equal(sixth.value);
      });

      it("should use the given owner", () => {
        const owner = new MockOwner();
        const stbl = StringTableResource.from(getBuffer("Normal"), {
          owner
        });
        expect(stbl.owner).to.equal(owner);
      });

      it("should not have an owner if not given", () => {
        const stbl = StringTableResource.from(getBuffer("Normal"));
        expect(stbl.owner).to.be.undefined;
      });

      it("should use the given defaultCompressionType", () => {
        const stbl = StringTableResource.from(getBuffer("Normal"), {
          defaultCompressionType: CompressionType.InternalCompression
        });
        expect(stbl.defaultCompressionType).to.equal(CompressionType.InternalCompression);
      });

      it("should use defaultCompressionType of ZLIB if not given", () => {
        const stbl = StringTableResource.from(getBuffer("Normal"));
        expect(stbl.defaultCompressionType).to.equal(CompressionType.ZLIB);
      });

      it("should use the given initialBufferCache if saveBuffer is true", () => {
        const buffer = getBuffer("Normal");
        const initialBufferCache: CompressedBuffer = {
          buffer,
          compressionType: CompressionType.Uncompressed,
          sizeDecompressed: buffer.byteLength
        };
        const stbl = StringTableResource.from(buffer, {
          initialBufferCache,
          saveBuffer: true
        });
        expect(stbl.hasBufferCache).to.be.true;
        expect(stbl.getCompressedBuffer(CompressionType.Uncompressed)).to.equal(initialBufferCache);
      });

      it("should not use the given initialBufferCache if saveBuffer is false", () => {
        const buffer = getBuffer("Normal");
        const initialBufferCache: CompressedBuffer = {
          buffer,
          compressionType: CompressionType.Uncompressed,
          sizeDecompressed: buffer.byteLength
        };
        const stbl = StringTableResource.from(buffer, {
          initialBufferCache
        });
        expect(stbl.hasBufferCache).to.be.false;
      });
    });

    context("stbl content is invalid", () => {
      it("should throw if recoveryMode = false", () => {
        const buffer = getBuffer("Corrupt");
        expect(() => StringTableResource.from(buffer, { recoveryMode: false })).to.throw();
      });

      it("should throw even if recoveryMode = true", () => {
        const buffer = getBuffer("Corrupt");
        expect(() => StringTableResource.from(buffer, { recoveryMode: true })).to.throw();
      });
    });

    context("stbl header is invalid", () => {
      it("should throw if recoveryMode = false", () => {
        const buffer = getBuffer("CorruptHeader");
        expect(() => StringTableResource.from(buffer, { recoveryMode: false })).to.throw();
      });

      it("should not throw if recoveryMode = true", () => {
        const buffer = getBuffer("CorruptHeader");
        expect(() => StringTableResource.from(buffer, { recoveryMode: true })).to.not.throw();
      });
    });
  });

  describe("static#fromAsync()", () => {
    it("should return a resource in a promise", () => {
      return StringTableResource.fromAsync(getBuffer("Normal")).then(stbl => {
        expect(stbl).to.be.instanceOf(StringTableResource);
        expect(stbl.size).to.equal(3);
      });
    });

    it("should reject if resource is invalid", () => {
      return StringTableResource.fromAsync(getBuffer("Corrupt")).then().catch(err => {
        expect(err).to.be.instanceOf(Error);
      });
    });
  });

  describe("static#merge()", () => {
    // TODO:
  });

  describe("static#mergeAsync()", () => {
    // TODO:
  });

  //#endregion Initialization

  //#region Methods

  describe("#add()", () => {
    it("should add the given entry to an empty table", () => {
      const stbl = new StringTableResource();
      expect(stbl.size).to.equal(0);
      stbl.add(123, "hi");
      expect(stbl.size).to.equal(1);
      const entry = stbl.get(0);
      expect(entry.key).to.equal(123);
      expect(entry.value).to.equal("hi");
    });

    it("should add the given entry to a table with entries", () => {
      const stbl = getStbl("Normal");
      expect(stbl.size).to.equal(3);
      stbl.add(123, "hi");
      expect(stbl.size).to.equal(4);
      const entry = stbl.get(3);
      expect(entry.key).to.equal(123);
      expect(entry.value).to.equal("hi");
    });

    it("should uncache the buffer", () => {
      const stbl = getStbl("Normal", true);
      expect(stbl.hasBufferCache).to.be.true;
      stbl.add(123, "hi");
      expect(stbl.hasBufferCache).to.be.false;
    });

    it("should add the key to the key map", () => {
      const stbl = new StringTableResource();
      expect(stbl.hasKey(123)).to.be.false;
      stbl.add(123, "hi");
      expect(stbl.hasKey(123)).to.be.true;
    });

    it("should reset the entries array", () => {
      const stbl = getStbl("Normal");
      const entries = stbl.entries;
      expect(entries).to.equal(stbl.entries);
      stbl.add(123, "hi");
      expect(entries).to.not.equal(stbl.entries);
    });

    it("should assign an ID to the entry that is created", () => {
      const stbl = new StringTableResource();
      stbl.add(0x12345678, "test");
      expect(stbl.entries[0].id).to.equal(0);
    });
  });

  describe("#addAll()", () => {
    it("should add the given entries", () => {
      const stbl = new StringTableResource();
      expect(stbl.size).to.equal(0);
      stbl.addAll([
        { key: 123, value: "hi" },
        { key: 456, value: "bye" }
      ]);
      expect(stbl.size).to.equal(2);
      const [first, second] = stbl.entries;
      expect(first.key).to.equal(123);
      expect(first.value).to.equal("hi");
      expect(second.key).to.equal(456);
      expect(second.value).to.equal("bye");
    });
  });

  describe("#addAndHash()", () => {
    it("should add the given string with its fnv32 hash", () => {
      const stbl = new StringTableResource();
      expect(stbl.size).to.equal(0);
      stbl.addAndHash("hello");
      expect(stbl.size).to.equal(1);
      expect(stbl.get(0).key).to.equal(fnv32("hello"));
    });
  });

  describe("#clear()", () => {
    it("should delete all entries", () => {
      const stbl = getStbl("Normal");
      expect(stbl.size).to.equal(3);
      stbl.clear();
      expect(stbl.size).to.equal(0);
    });

    it("should reset the key map", () => {
      const stbl = getStbl("Normal");
      const key = stbl.get(0).key;
      expect(stbl.hasKey(key)).to.be.true;
      stbl.clear();
      expect(stbl.hasKey(key)).to.be.false;
    });

    it("should uncache the buffer", () => {
      const stbl = getStbl("Normal", true);
      expect(stbl.hasBufferCache).to.be.true;
      stbl.clear();
      expect(stbl.hasBufferCache).to.be.false;
    });

    it("should reset the entries property", () => {
      const stbl = getStbl("Normal");
      const entries = stbl.entries;
      stbl.clear();
      const newEntries = stbl.entries;
      expect(newEntries).to.not.equal(entries);
      expect(newEntries).to.be.an('Array').that.is.empty;
    });

    it("should reset the ID counter", () => {
      const stbl = getStbl("Normal");
      stbl.clear();
      const entry = stbl.addAndHash("hi");
      expect(stbl.getIdForKey(entry.key)).to.equal(0);
    });
  });

  describe("#clone()", () => {
    it("should copy the entries", () => {
      const stbl = new StringTableResource([
        { key: 123, value: "hi" },
        { key: 456, value: "bye" }
      ]);

      const clone = stbl.clone();

      expect(clone.size).to.equal(2);
      const [first, second] = clone.entries;
      expect(first.key).to.equal(123);
      expect(first.value).to.equal("hi");
      expect(second.key).to.equal(456);
      expect(second.value).to.equal("bye");
    });

    it("should not mutate the original", () => {
      const stbl = new StringTableResource([
        { key: 123, value: "hi" },
        { key: 456, value: "bye" }
      ]);

      const clone = stbl.clone();
      clone.add(789, "yeehaw");
      expect(clone.size).to.equal(3);
      expect(stbl.size).to.equal(2);
    });

    it("should not mutate the entries of the original", () => {
      const stbl = new StringTableResource([
        { key: 123, value: "hi" },
        { key: 456, value: "bye" }
      ]);

      const clone = stbl.clone();
      clone.getByKey(123).value = "hello";
      expect(clone.getByKey(123).value).to.equal("hello");
      expect(stbl.getByKey(123).value).to.equal("hi");
    });

    it("should not copy the owner", () => {
      const owner = new MockOwner();
      const stbl = new StringTableResource();
      stbl.owner = owner;
      expect(stbl.owner).to.equal(owner);
      const clone = stbl.clone();
      expect(clone.owner).to.be.undefined;
    });

    it("should set itself as the owner of the new entries", () => {
      const stbl = new StringTableResource([
        { key: 123, value: "hi" },
        { key: 456, value: "bye" }
      ]);

      const clone = stbl.clone();
      const [first, second] = clone.entries;
      expect(first.owner).to.equal(clone);
      expect(second.owner).to.equal(clone);
    });
  });

  describe("#delete()", () => {
    it("should delete the entry with the given ID", () => {
      const stbl = getStbl("Normal");
      expect(stbl.has(1)).to.be.true;
      stbl.delete(1);
      expect(stbl.has(1)).to.be.false;
    });

    it("should uncache the buffer", () => {
      const stbl = getStbl("Normal", true);
      expect(stbl.hasBufferCache).to.be.true;
      stbl.delete(1);
      expect(stbl.hasBufferCache).to.be.false;
    });

    it("should remove the key from the key map", () => {
      const stbl = getStbl("Normal");
      expect(stbl.hasKey(0xF098F4B5)).to.be.true;
      stbl.delete(1);
      expect(stbl.hasKey(0xF098F4B5)).to.be.false;
    });

    it("should update the ID in the key map if there is another entry with the same key", () => {
      const stbl = getStbl("RepeatedStrings");
      expect(stbl.getIdForKey(0x849FFEE6)).to.equal(4);
      stbl.delete(4);
      expect(stbl.getIdForKey(0x849FFEE6)).to.equal(5);
    });

    it("should reset the entries array", () => {
      const stbl = getStbl("RepeatedStrings");
      const entries = stbl.entries;
      expect(entries).to.equal(stbl.entries);
      stbl.delete(0);
      expect(entries).to.not.equal(stbl.entries);
    });
  });

  describe("#deleteByKey()", () => {
    it("should delete the entry with the given key", () => {
      const stbl = getStbl("Normal");
      expect(stbl.hasKey(0xF098F4B5)).to.be.true;
      stbl.deleteByKey(0xF098F4B5);
      expect(stbl.hasKey(0xF098F4B5)).to.be.false;
    });
  });

  describe("#equals()", () => {
    it("should return true if stbls have the same entries", () => {
      const stbl = getStbl("Normal");
      const other = stbl.clone();
      expect(stbl.equals(other)).to.be.true;
    });

    it("should return false if an entry has a different key", () => {
      const stbl = getStbl("Normal");
      const other = stbl.clone();
      other.get(0).key = 123;
      expect(stbl.equals(other)).to.be.false;
    });

    it("should return false if an entry has a different value", () => {
      const stbl = getStbl("Normal");
      const other = stbl.clone();
      other.get(0).value = "hi";
      expect(stbl.equals(other)).to.be.false;
    });
  });

  describe("#findRepeatedKeys()", () => {
    it("should be empty when there are no repeated keys", () => {
      const stbl = getStbl("Normal");
      const keys = stbl.findRepeatedKeys();
      expect(keys).to.be.an('Array').that.is.empty;
    });

    it("should return all keys that are repeated", () => {
      const stbl = getStbl("RepeatedStrings");
      const keys = stbl.findRepeatedKeys();
      expect(keys).to.be.an('Array').with.lengthOf(2);
      expect(keys[0]).to.equal(0xCFE9989D);
      expect(keys[1]).to.equal(0x849FFEE6);
    });
  });

  describe("#get()", () => {
    it("should return the entry with the given ID", () => {
      const stbl = getStbl("Normal");
      const entry = stbl.get(1);
      expect(entry.key).to.equal(0xF098F4B5);
      expect(entry.value).to.equal("This is another string!");
    });

    it("should return the same item for the same ID even if one before it is removed", () => {
      const stbl = getStbl("Normal");
      stbl.delete(0);
      const entry = stbl.get(1);
      expect(entry.key).to.equal(0xF098F4B5);
      expect(entry.value).to.equal("This is another string!");
    });

    it("should return undefined if the given ID doesn't exist", () => {
      const stbl = getStbl("Normal");
      expect(stbl.get(3)).to.be.undefined;
    });
  });

  describe("#getByKey()", () => {
    it("should return the entry with the given key", () => {
      const stbl = getStbl("Normal");
      expect(stbl.getByKey(0x7E08629A).value).to.equal("This is a string.");
      expect(stbl.getByKey(0xF098F4B5).value).to.equal("This is another string!");
      expect(stbl.getByKey(0x8D6D117D).value).to.equal("And this, this is a third.");
    });

    it("should return an entry after adding it", () => {
      const stbl = new StringTableResource();
      stbl.add(123, "hi");
      expect(stbl.getByKey(123).value).to.equal("hi");
    });

    it("should return the correct entry after changing its key", () => {
      const stbl = new StringTableResource();
      const entry = stbl.add(123, "hi");
      entry.key = 456;
      expect(stbl.getByKey(456).value).to.equal("hi");
    });

    it("should return undefined after removing the entry", () => {
      const stbl = new StringTableResource();
      const entry = stbl.add(123, "hi");
      entry.key = 456;
      expect(stbl.getByKey(123)).to.be.undefined;
    });

    it("should return the first entry with the given key if there are more than one", () => {
      const stbl = getStbl("RepeatedStrings");
      expect(stbl.getByKey(0x849FFEE6).value).to.equal("The next one has the same key.");
    });

    it("should return undefined if the given key doesn't exist", () => {
      const stbl = getStbl("Normal");
      expect(stbl.getByKey(0)).to.be.undefined;
    });

    it("should return the correct entry if there are more than one entry with this key, and the first was deleted", () => {
      const stbl = new StringTableResource();
      stbl.add(123, "hi");
      stbl.add(123, "bye");
      expect(stbl.getByKey(123).value).to.equal("hi");
      stbl.deleteByKey(123);
      expect(stbl.getByKey(123).value).to.equal("bye");
      stbl.deleteByKey(123);
      expect(stbl.getByKey(123)).to.be.undefined;
    });
  });

  describe("#getByValue()", () => {
    it("should return the first entry with the given value", () => {
      const stbl = new StringTableResource([
        { key: 1, value: "first" },
        { key: 2, value: "second" },
        { key: 3, value: "last" },
        { key: 4, value: "last" },
      ]);

      expect(stbl.getByValue("first").key).to.equal(1);
      expect(stbl.getByValue("second").key).to.equal(2);
      expect(stbl.getByValue("last").key).to.equal(3);
    });

    it("should return undefined if no entries have the given value", () => {
      const stbl = new StringTableResource([
        { key: 1, value: "first" },
        { key: 2, value: "second" },
        { key: 3, value: "third" },
      ]);

      expect(stbl.getByValue("last")).to.be.undefined;
    });
  });

  describe("#getIdForKey()", () => {
    it("should return the ID for the given key", () => {
      const stbl = getStbl("Normal");
      expect(stbl.getIdForKey(0x7E08629A)).to.equal(0);
      expect(stbl.getIdForKey(0xF098F4B5)).to.equal(1);
      expect(stbl.getIdForKey(0x8D6D117D)).to.equal(2);
    });

    it("should return the first ID for the given key if there are more than one", () => {
      const stbl = getStbl("RepeatedStrings");
      expect(stbl.getIdForKey(0x849FFEE6)).to.equal(4);
    });

    it("should return undefined after the entry with the key is deleted", () => {
      const stbl = getStbl("Normal");
      stbl.deleteByKey(0xF098F4B5);
      expect(stbl.getIdForKey(0xF098F4B5)).to.be.undefined;
    });

    it("should return the ID for an entry after adding it", () => {
      const stbl = new StringTableResource();
      stbl.add(123, "hi");
      expect(stbl.getIdForKey(123)).to.equal(0);
    });
  });

  describe("#getIdsForKey()", () => {
    it("should return an empty array if no entries have this key", () => {
      const stbl = getStbl("Normal");
      const ids = stbl.getIdsForKey(0);
      expect(ids).to.be.an('Array').that.is.empty;
    });

    it("should return the ID for the given key", () => {
      const stbl = getStbl("Normal");
      const entry = stbl.get(1);
      const ids = stbl.getIdsForKey(entry.key);
      expect(ids).to.be.an('Array').with.lengthOf(1);
      expect(ids[0]).to.equal(1);
    });

    it("should return all IDs for the given key", () => {
      const stbl = getStbl("Normal");
      const entry = stbl.get(0);
      stbl.add(entry.key, entry.value);
      const ids = stbl.getIdsForKey(entry.key);
      expect(ids).to.be.an('Array').with.lengthOf(2);
      expect(ids[0]).to.equal(0);
      expect(ids[1]).to.equal(3);
    });
  });

  describe("#has()", () => {
    it("should return true if the ID is in the model", () => {
      const stbl = getStbl("Normal");
      expect(stbl.has(2)).to.be.true;
    });

    it("should return true if the ID was not in the model but was added", () => {
      const stbl = getStbl("Normal");
      expect(stbl.has(3)).to.be.false;
      stbl.add(123, "hi");
      expect(stbl.has(3)).to.be.true;
    });

    it("should return false if the ID is not in the model", () => {
      const stbl = getStbl("Normal");
      expect(stbl.has(4)).to.be.false;
    });

    it("should return false if the ID was in the model but was removed", () => {
      const stbl = getStbl("Normal");
      expect(stbl.has(1)).to.be.true;
      stbl.delete(1);
      expect(stbl.has(1)).to.be.false;
    });
  });

  describe("#hasKey()", () => {
    it("should return true if the key is in the model", () => {
      const stbl = getStbl("Normal");
      expect(stbl.hasKey(0x7E08629A)).to.be.true;
    });

    it("should return true if the key was not in the model but was added", () => {
      const stbl = getStbl("Normal");
      expect(stbl.hasKey(123)).to.be.false;
      stbl.add(123, "hi");
      expect(stbl.hasKey(123)).to.be.true;
    });

    it("should return false if the key is not in the model", () => {
      const stbl = getStbl("Normal");
      expect(stbl.hasKey(123)).to.be.false;
    });

    it("should return false if the key was in the model but was removed", () => {
      const stbl = getStbl("Normal");
      expect(stbl.hasKey(0x7E08629A)).to.be.true;
      stbl.deleteByKey(0x7E08629A);
      expect(stbl.hasKey(0x7E08629A)).to.be.false;
    });

    it("should return true if there are more than one entry with this key, and the first was deleted", () => {
      const stbl = new StringTableResource();
      stbl.add(123, "hi");
      stbl.add(123, "bye");
      stbl.deleteByKey(123);
      expect(stbl.hasKey(123)).to.be.true;
    });
  });

  describe("#hasValue()", () => {
    it("should return true if the stbl contains the given value", () => {
      const stbl = new StringTableResource([{ key: 1, value: "hi" }]);
      expect(stbl.hasValue("hi")).to.be.true;
    });

    it("should return false if the stbl does not contain the given value", () => {
      const stbl = new StringTableResource([{ key: 1, value: "hello" }]);
      expect(stbl.hasValue("hi")).to.be.false;
    });

    it("should return false if the stbl is empty", () => {
      const stbl = new StringTableResource();
      expect(stbl.hasValue("hi")).to.be.false;
    });
  });

  describe("#isXml()", () => {
    it("should return false", () => {
      const stbl = new StringTableResource();
      expect(stbl.isXml()).to.be.false;
    });
  });

  describe("#resetEntries()", () => {
    it("should force the entries to make a new list", () => {
      const stbl = getStbl("Normal");
      const entries = stbl.entries;
      expect(entries).to.equal(stbl.entries);
      stbl.resetEntries();
      expect(entries).to.not.equal(stbl.entries);
    });
  });

  describe("#onChange()", () => {
    it("should uncache the buffer if saveBuffer = true", () => {
      const stbl = getStbl("Normal", true);
      expect(stbl.hasBufferCache).to.be.true;
      stbl.onChange();
      expect(stbl.hasBufferCache).to.be.false;
    });

    it("should notify the owner to uncache if saveBuffer = true", () => {
      const owner = new MockOwner();
      const stbl = getStbl("Normal", true);
      stbl.owner = owner;
      expect(owner.cached).to.be.true;
      stbl.onChange();
      expect(owner.cached).to.be.false;
    });

    it("should notify the owner to uncache if saveBuffer = false", () => {
      const owner = new MockOwner();
      const stbl = getStbl("Normal", false);
      stbl.owner = owner;
      expect(owner.cached).to.be.true;
      stbl.onChange();
      expect(owner.cached).to.be.false;
    });

    it("should reset the entries", () => {
      const stbl = getStbl("Normal");
      const entries = stbl.entries;
      expect(entries).to.equal(stbl.entries);
      stbl.onChange();
      expect(entries).to.not.equal(stbl.entries);
    });
  });

  describe("#validate()", () => {
    it("should not throw if all entries are valid", () => {
      const stbl = getStbl("Normal");
      expect(() => stbl.validate()).to.not.throw();
    });

    it("should throw if at least one entry is not valid", () => {
      const stbl = getStbl("Normal");
      stbl.get(0).key = -1;
      expect(() => stbl.validate()).to.throw();
    });

    it("should throw if there are multiple strings with the same key", () => {
      const stbl = getStbl("Normal");
      const entry = stbl.get(0);
      stbl.add(entry.key, entry.value);
      expect(() => stbl.validate()).to.throw();
    });
  });

  describe("#getBuffer()", () => {
    it("should serialize a stbl that is empty", () => {
      const original = new StringTableResource();
      const stbl = StringTableResource.from(original.getBuffer());
      expect(stbl).to.not.equal(original);
      expect(stbl.size).to.equal(0);
    });

    it("should return the cached buffer if it wasn't changed", () => {
      const buffer = getBuffer("Normal");
      const stbl = StringTableResource.from(buffer, { saveBuffer: true });
      expect(stbl.getBuffer()).to.equal(buffer);
    });

    it("should serialize a stbl that wasn't changed, but was uncached", () => {
      const buffer = getBuffer("Normal");
      const stbl = StringTableResource.from(buffer, { saveBuffer: true });
      stbl.onChange();
      expect(stbl.getBuffer()).to.not.equal(buffer);
      expect(stbl.equals(getStbl("Normal"))).to.be.true;
    });

    it("should serialize a stbl that had entries added", () => {
      const original = getStbl("Normal", true);
      original.addAndHash("new string");
      const stbl = StringTableResource.from(original.getBuffer());
      expect(stbl).to.not.equal(original);
      expect(stbl.equals(original)).to.be.true;
    });

    it("should serialize a stbl that had entries removed", () => {
      const original = getStbl("Normal", true);
      original.delete(0);
      const stbl = StringTableResource.from(original.getBuffer());
      expect(stbl).to.not.equal(original);
      expect(stbl.equals(original)).to.be.true;
    });

    it("should serialize a stbl that had entries mutated", () => {
      const original = getStbl("Normal", true);
      original.get(0).value = "new string";
      const stbl = StringTableResource.from(original.getBuffer());
      expect(stbl).to.not.equal(original);
      expect(stbl.equals(original)).to.be.true;
    });
  });

  describe("#toJsonObject()", () => {
    it("should use hex keys by default", () => {
      const stbl = getStbl("Normal");
      const json = stbl.toJsonObject();
      expect(json[0].key).to.be.a("string").that.equals("0x7E08629A");
    });

    it("should use number keys if specified", () => {
      const stbl = getStbl("Normal");
      const json = stbl.toJsonObject(false);
      expect(json[0].key).to.be.a("number").that.equals(0x7E08629A);
    });

    it("should exclude IDs by default", () => {
      const stbl = getStbl("Normal");
      const json = stbl.toJsonObject();
      expect(json[0].id).to.be.undefined;
    });

    it("should include IDs if specified", () => {
      const stbl = getStbl("Normal");
      const json = stbl.toJsonObject(undefined, true);
      expect(json[0].id).to.be.a("number").that.equals(0);
    });

    it("should include all entries", () => {
      const stbl = getStbl("Normal");
      const json = stbl.toJsonObject(undefined, true);
      expect(json).to.be.an("Array").with.lengthOf(3);
      expect(json[0].value).to.equal("This is a string.");
      expect(json[1].value).to.equal("This is another string!");
      expect(json[2].value).to.equal("And this, this is a third.");
    });

    it("should not produce an array that mutates the model", () => {
      const stbl = getStbl("Normal");
      const json = stbl.toJsonObject(undefined, true);
      json.push({
        id: 3,
        key: 0x12345678,
        value: "test string"
      });
      expect(stbl.size).to.equal(3);
      expect(stbl.get(3)).to.be.undefined;
    });

    it("should not produce entries that mutate the model", () => {
      const stbl = getStbl("Normal");
      const json = stbl.toJsonObject(undefined, true);
      json[0].value = "Changed string.";
      expect(stbl.entries[0].value).to.equal("This is a string.");
    });
  });

  describe("#replaceEntries()", () => {
    it("should regenerate the entries' IDs", () => {
      const stbl = getStbl("Normal");
      stbl.delete(1);
      expect(stbl.get(2)).to.not.be.undefined;
      stbl.replaceEntries(stbl.entries);
      expect(stbl.get(2)).to.be.undefined;
    });

    it("should replace the existing entries", () => {
      const stbl = getStbl("Normal");

      stbl.replaceEntries([
        {
          key: 0x12345678,
          value: "first"
        }
      ]);

      expect(stbl.size).to.equal(1);
      expect(stbl.get(0).key).to.equal(0x12345678);
      expect(stbl.get(0).value).to.equal("first");
    });

    it("should disable mutation from the previous entries", () => {
      const stbl = getStbl("Normal");
      const previousFirst = stbl.get(0);
      expect(previousFirst.key).to.equal(0x7E08629A);
      stbl.replaceEntries(stbl.entries);
      previousFirst.key = 0x12345678;
      expect(stbl.get(0).key).to.equal(0x7E08629A);
    });
  });

  //#endregion Methods
});
