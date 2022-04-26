import { expect } from "chai";
import { CompressionType } from "@s4tk/compression";
import MockWritableModel from "./mock-writable-model";
import MockOwner from "./mock-owner";

describe("MockWritableModel", () => {
  //#region Properties

  describe("#defaultCompressionType", () => {
    it("should return the value", () => {
      // TODO:
    });

    it("should change the value when set", () => {
      // TODO:
    });
  });

  describe("#hasBufferCache", () => {
    it("should be true when there is a buffer cached", () => {
      // TODO:
    });

    it("should be true when there wasn't a buffer cached, but one was generated", () => {
      // TODO:
    });

    it("should be false when there is no buffer cached", () => {
      // TODO:
    });

    it("should be false when there was buffer cached, but it was deleted", () => {
      // TODO:
    });
  });

  //#endregion Properties

  //#region Initialization

  describe("#constructor", () => {
    it("should have an undefined owner if one was not provided", () => {
      const model = new MockWritableModel();
      expect(model.owner).to.be.undefined;
    });

    it("should use the owner that was provided", () => {
      const owner = new MockOwner();
      const model = new MockWritableModel("", { owner });
      expect(model.owner).to.equal(owner);
    });

    it("should set defaultCompressionType to ZLIB if not provided", () => {
      const model = new MockWritableModel();
      expect(model.defaultCompressionType).to.equal(CompressionType.ZLIB);
    });

    it("should use the defaultCompressionType that was provided", () => {
      const model = new MockWritableModel("", {
        defaultCompressionType: CompressionType.Uncompressed
      });

      expect(model.defaultCompressionType).to.equal(CompressionType.Uncompressed);
    });

    it("should not have a cache if initialBufferCache was not provided", () => {
      const model = new MockWritableModel();
      expect(model.hasBufferCache).to.be.false;
    });

    it("should use the initialBufferCache that was provided", () => {
      const model = new MockWritableModel("hi", {
        initialBufferCache: {
          buffer: Buffer.from("hi"),
          compressionType: CompressionType.Uncompressed,
          sizeDecompressed: 2
        }
      });

      expect(model.hasBufferCache).to.be.true;
    });
  });

  //#endregion Initialization

  //#region Methods

  describe("#getBuffer()", () => {
    context("cache = true", () => {
      context("has compressed cache", () => {
        it("should decompress the cache and return the result", () => {
          // TODO:
        });

        it("should overwrite the existing cache", () => {
          // TODO:
        });
      });

      context("has uncompressed cache", () => {
        it("should return the cached buffer", () => {
          // TODO:
        });

        it("should not replace the cache", () => {
          // TODO:
        });
      });

      context("does not have cache", () => {
        it("should serialize the model and return an uncompressed buffer", () => {
          // TODO:
        });

        it("should set the cache", () => {
          // TODO:
        });
      });
    });

    context("cache = false", () => {
      context("has compressed cache", () => {
        it("should decompress the cache and return the result", () => {
          // TODO:
        });

        it("should not overwrite the existing cache", () => {
          // TODO:
        });
      });

      context("has uncompressed cache", () => {
        it("should return the cached buffer", () => {
          // TODO:
        });

        it("should not delete the cache", () => {
          // TODO:
        });
      });

      context("does not have cache", () => {
        it("should serialize the model and return an uncompressed buffer", () => {
          // TODO:
        });

        it("should not set the cache", () => {
          // TODO:
        });
      });
    });
  });

  describe("#getBufferAsync()", () => {
    it("should return the same result as getBuffer()", () => {
      // TODO:
    });
  });

  describe("#getCompressedBuffer()", () => {
    context("cache = true", () => {
      context("has correctly compressed cache", () => {
        it("should return the cached buffer", () => {
          // TODO:
        });

        it("should not replace the cache", () => {
          // TODO:
        });
      });

      context("has other cache", () => {
        it("should compress/convert the cache and return the result", () => {
          // TODO:
        });

        it("should overwrite the existing cache", () => {
          // TODO:
        });
      });

      context("does not have cache", () => {
        it("should serialize the model and return a compressed buffer", () => {
          // TODO:
        });

        it("should set the cache", () => {
          // TODO:
        });
      });
    });

    context("cache = false", () => {
      context("has correctly compressed cache", () => {
        it("should return the cached buffer", () => {
          // TODO:
        });

        it("should not delete the cache", () => {
          // TODO:
        });
      });

      context("has other cache", () => {
        it("should compress/convert the cache and return the result", () => {
          // TODO:
        });

        it("should not overwrite the existing cache", () => {
          // TODO:
        });
      });

      context("does not have cache", () => {
        it("should serialize the model and return a compressed buffer", () => {
          // TODO:
        });

        it("should not set the cache", () => {
          // TODO:
        });
      });
    });
  });

  describe("#getCompressedBufferAsync()", () => {
    it("should return the same result as getCompressedBuffer()", () => {
      // TODO:
    });
  });

  describe("#onChange()", () => {
    it("should clear the cache", () => {
      // TODO:
    });

    it("should clear the owner's cache", () => {
      // TODO:
    });
  });

  //#endregion Methods
});
