import fs from "fs";
import path from "path";
import { expect } from "chai";
import { ObjectDefinitionResource } from "../../../../dst/models";
import { EncodingType, ObjectDefinitionPropertyType } from "../../../../dst/enums";
import MockOwner from "../../../mocks/mock-owner";

const tartosianoBuffer = fs.readFileSync(
  path.resolve(
    __dirname,
    "../../../data/obj-definitions/TartosianoTextbook.binary"
  )
);

describe("ObjectDefinitionResource", () => {
  //#region Properties

  describe("#encodingType", () => {
    it("should be OBJDEF", () => {
      const def = ObjectDefinitionResource.from(tartosianoBuffer);
      expect(def.encodingType).to.equal(EncodingType.OBJDEF);
    });
  });

  describe("#properties", () => {
    // FIXME: this should be changed eventually
    it("should not uncache the owner when mutated", () => {
      const owner = new MockOwner();
      const def = ObjectDefinitionResource.from(tartosianoBuffer, {
        owner
      });

      expect(owner.cached).to.be.true;
      def.properties.IsBaby = true;
      expect(owner.cached).to.be.true;
    });

    // FIXME: this should be changed eventually
    it("should not uncache the owner when values mutated", () => {
      const owner = new MockOwner();
      const def = ObjectDefinitionResource.from(tartosianoBuffer, {
        owner
      });

      expect(owner.cached).to.be.true;
      def.properties.Components!.push(123);
      expect(owner.cached).to.be.true;
    });

    it("should uncache the owner when set", () => {
      const owner = new MockOwner();
      const def = ObjectDefinitionResource.from(tartosianoBuffer, {
        owner
      });

      expect(owner.cached).to.be.true;
      def.properties = def.properties;
      expect(owner.cached).to.be.false;
    });
  });

  describe("#version", () => {
    it("should be 2", () => {
      const def = ObjectDefinitionResource.from(tartosianoBuffer);
      expect(def.version).to.equal(2);
    });

    it("should uncache the owner when set", () => {
      const owner = new MockOwner();
      const def = ObjectDefinitionResource.from(tartosianoBuffer, {
        owner
      });

      expect(owner.cached).to.be.true;
      def.version = 3;
      console.log(def.version);

      expect(owner.cached).to.be.false;
    });
  });

  //#endregion Properties

  //#region Initialization

  describe("#constructor", () => {
    it("should use the provided version", () => {
      // TODO:
    });

    it("should use the provided properties", () => {
      // TODO:
    });

    it("should be mutated if original properties are mutated", () => {
      // TODO:
    });

    it("should use ZLIB compression by default", () => {
      // TODO:
    });

    it("should use the provided defaultCompressionType", () => {
      // TODO:
    });

    it("should not have any initial cache by default", () => {
      // TODO:
    });

    it("should use the provided initialBufferCache", () => {
      // TODO:
    });

    it("should not have an owner by default", () => {
      // TODO:
    });

    it("should use the provided owner", () => {
      // TODO:
    });
  });

  describe("#from()", () => {
    it("should get the correct Name value", () => {
      // TODO:
    });

    it("should get the correct Tuning value", () => {
      // TODO:
    });

    it("should get the correct MaterialVariant value", () => {
      // TODO:
    });

    it("should get the correct TuningId value", () => {
      // TODO:
    });

    it("should get the correct Icon value", () => {
      // TODO:
    });

    it("should get the correct Rig value", () => {
      // TODO:
    });

    it("should get the correct Slot value", () => {
      // TODO:
    });

    it("should get the correct Model value", () => {
      // TODO:
    });

    it("should get the correct Footprint value", () => {
      // TODO:
    });

    it("should get the correct Components value", () => {
      // TODO:
    });

    it("should get the correct SimoleonPrice value", () => {
      // TODO:
    });

    it("should get the correct ThumbnailGeometryState value", () => {
      // TODO:
    });

    it("should get the correct PositiveEnvironmentScore value", () => {
      // TODO:
    });

    it("should get the correct NegativeEnvironmentScore value", () => {
      // TODO:
    });

    it("should get the correct EnvironmentScoreEmotionTags value", () => {
      // TODO:
    });

    it("should get the correct EnvironmentScoreEmotionTags_32 value", () => {
      // TODO:
    });

    it("should get the correct EnvironmentScores value", () => {
      // TODO:
    });

    it("should get the correct IsBaby value", () => {
      // TODO:
    });

    it("should not have an UnknownMisc set if there are no unknowns", () => {
      // TODO:
    });

    it("should not include keys for any properties that aren't defined", () => {
      // TODO:
    });

    it("should include unknown types in the UnknownMisc set", () => {
      // TODO:
    });

    it("should use ZLIB compression by default", () => {
      // TODO:
    });

    it("should use the provided defaultCompressionType", () => {
      // TODO:
    });

    it("should not have an owner by default", () => {
      // TODO:
    });

    it("should use the provided owner", () => {
      // TODO:
    });

    it("should fail if version ≠ 2 by default", () => {
      // TODO:
    });

    it("should not fail if version ≠ 2 but recoveryMode is true", () => {
      // TODO:
    });

    it("should not cache the buffer by default", () => {
      // TODO:
    });

    it("should cache the buffer if saveBuffer is true", () => {
      // TODO:
    });
  });

  describe("#fromAsync()", () => {
    it("should return an obj def asynchronously", () => {
      // TODO:
    });

    it("should use the given options", () => {
      // TODO:
    });
  });

  //#endregion Initialization

  //#region Methods

  describe("#clone()", () => {
    it("should copy the original's version", () => {
      // TODO:
    });

    it("should copy the original's properties", () => {
      // TODO:
    });

    it("should copy the original's buffer cache if present", () => {
      // TODO:
    });

    it("should not have buffer cache if original doesn't", () => {
      // TODO:
    });

    it("should copy the original's default compression type", () => {
      // TODO:
    });

    it("should not copy the original's owner", () => {
      // TODO:
    });

    it("should not mutate the original's version", () => {
      // TODO:
    });

    it("should not mutate the original's properties", () => {
      // TODO:
    });

    it("should not mutate the original's properties primitive values", () => {
      // TODO:
    });

    it("should not mutate the original's properties mutable values", () => {
      // TODO:
    });
  });

  describe("#equals()", () => {
    // TODO:
  });

  describe("#getBuffer()", () => {
    // TODO:
  });

  describe("#isXml()", () => {
    it("should always return false", () => {
      // TODO:
    });
  });

  describe("#onChange()", () => {
    it("should delete the buffer cache", () => {
      // TODO:
    });

    it("should uncache the owner", () => {
      // TODO:
    });
  });

  //#endregion Methods
});
