const { expect } = require('chai');
const { inspect } = require('util');
const { tunables, StringTableResource } = require('../../dst/api');
const { I, M, T, E, V, U, L, C, S, getStringNodeFunction } = tunables;

// const stbl = StringTableResource.create();
// const S = getStringNodeFunction(stbl);


describe('tunables', function() {
  describe('#getStringNodeFunction()', function() {
    it('should add the strings to the string table', function() {
      const stbl = StringTableResource.create();
      const S = getStringNodeFunction(stbl);

      L({
        children: [
          S({ string: 'First' }),
          S({ string: 'Second' }),
          S({ string: 'Third' }),
        ]
      });

      expect(stbl).to.have.lengthOf(3);
      expect(stbl.entries[0].string).to.equal('First');
      expect(stbl.entries[0].string).to.equal('Second');
      expect(stbl.entries[0].string).to.equal('Third');
    });

    it('should hash the string if no alternative is given', function() {
      // TODO:
    });

    it('should hash the toHash argument if given', function() {
      // TODO:
    });

    it('should return a tunable with a name, value, and comment', function() {
      // TODO:
    });
  });

  describe('#S()', function() {
    it('should add the strings to the string table', function() {
      const stbl = StringTableResource.create();

      L({
        children: [
          S({ string: 'First', stbl }),
          S({ string: 'Second', stbl }),
          S({ string: 'Third', stbl }),
        ]
      });

      expect(stbl).to.have.lengthOf(3);
      expect(stbl.entries[0].string).to.equal('First');
      expect(stbl.entries[0].string).to.equal('Second');
      expect(stbl.entries[0].string).to.equal('Third');
    });

    it('should hash the string if no alternative is given', function() {
      // TODO:
    });

    it('should hash the toHash argument if given', function() {
      // TODO:
    });

    it('should return a tunable with a name, value, and comment', function() {
      // TODO:
    });
  });
});




// const inst = I({
//   c: "Trait",
//   i: "trait",
//   m: "traits.trait",
//   n: "trait_Example",
//   s: 1234567890,
//   children: [
//     T({
//       name: "first_item",
//       value: true
//     }),
//     T({
//       name: "a",
//       value: 32n
//     }),
//     S({
//       name: "string",
//       string: "Hello world"
//     }),
//     L({
//       name: "some_list",
//       children: [
//         V({ type: "disabled" }),
//         V({ type: "disabled", comment: "This is a disabled variant." }),
//         V({
//           type: "enabled",
//           child: U({
//             name: "enabled",
//             comment: "This is a tuple",
//             children: [
//               E({ name: "species", value: "HUMAN" }),
//               E({ name: "age", value: "ADULT" }),
//             ]
//           })
//         })
//       ]
//     })
//   ]
// });

// // console.log(stbl.entries);

// const xml = inst.toXml({ includeDeclaration: true, alphabetize: true });

// it('test', function() {
//   console.log(xml);
// })


// const { TunableNodes, Hashing, StringTableResource } = require('../../../dst/api');
// const { parseXML } = require('../../../dst/lib/services/Parsing');

// const { I, M, T, E, V, L, U, S } = TunableNodes;

// describe('TunableNodes', function() {
//   describe('#nodeToString()', function() {
//     it('temporary test', function() {
//       const stbl = StringTableResource.create();
//       const S = TunableNodes.getStringFn(stbl);

//       const node = I({
//         c: "Trait",
//         i: "trait",
//         m: "traits.trait",
//         n: "frankk_TEST:trait_Example",
//         s: Hashing.fnv32("frankk_TEST:trait_Example"),
//         children: [
//           L({
//             name: "ages",
//             children: [
//               E({ value: "YOUNGADULT" }),
//               E({ value: "ADULT" }),
//               E({ value: "ELDER" })
//             ]
//           }),
//           T({
//             name: "display_name",
//             value: S("Trait Name")
//           }),
//           U({
//             name: "example_tuple",
//             children: [
//               V({
//                 name: "variant1",
//                 type: "disabled"
//               }),
//               V({
//                 name: "variant2",
//                 type: "enabled",
//                 child: T({
//                   name: "enabled",
//                   value: true
//                 })
//               })
//             ]
//           })
//         ]
//       });

//       const xml = TunableNodes.nodeToXML(node, { includeDeclaration: true });
//       console.log(xml);
//     });

//     it('temp test 2', function() {
//       const xml = `<?xml version="1.0" encoding="utf-8"?>
// <I c="Class" i="type" m="module.path" n="example_file" s="12345">
//   <L>
//     <U>
//       <T n="first">50</T>
//       <V n="third" t="disabled" />
//       <E n="enabled">ADULT</E>
//       <V n="fourth" t="enabled">
//         <T n="enabled">0x12345678<!--String--></T>
//       </V>
//     </U>
//     <U>
//       <T n="first">50</T>
//       <V n="third" t="disabled" />
//       <E n="enabled">ADULT</E>
//       <V n="fourth" t="enabled">
//         <T n="enabled">0x12345678<!--String--></T>
//       </V>
//     </U>
//   </L>
// </I>`;

//       const nodes = parseXML(xml);
//       console.log(inspect(nodes, {showHidden: false, depth: null, colors: true}));
//     })
//   });
// });
