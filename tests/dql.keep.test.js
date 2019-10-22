const dql = require('../src');

describe('[dql] { keep: true }', () => {
  let data = {};
  beforeEach(() => {
    data = {
      test: {
        test2: {
          test3: {
            test4: {
              test5: 10,
              box: [
                { name: { full: true }, age: 10 },
                { name: { full: false }, age: 2 }
              ]
            },
            age: 10
          }
        }
      },
      peoples: 2
    };
  });

  test('should return full object structure', () => {
    const value = dql(data, { keep: true })`
      test {
        test2 {
          test3 {
            test4 {
               test5
            }
          }
        }
      }`;

    expect(value).toEqual({ test: { test2: {test3: {test4: { test5: 10  }}}}});
  });

  test('should works in arrays', () => {
    const value = dql(data, { keep: true })`
      test {
        test2 {
          test3 {
            test4 {
              box {
                name
              }
            }
          }
        }
      }`;

    const dataExpected = {
      test: {
        test2: {
          test3: {
            test4: {
              box: [
                { name: { full: true } },
                { name: { full: false } }
              ]
            }
          }
        }
      }
    };

    expect(value).toEqual(dataExpected);
  });


  test('should return key if is not found', () => {
    const value = dql(data, { keep: true })`
      test {
        testdsjj
      }`;

    expect(value).toEqual({ test: {} });
  });


  test('should filter by key from array', () => {
    const value = dql(data, { keep: true })`
      test {
        test2 {
          test3 {
            test4 {
               box(age: 10) {
                  name,
                  age
               }
            }
          }
        }
      }`;

    const dataFiltered = {
      test: {
        test2: {
          test3: {
            test4: {
              box: [
                { name: { full: true }, age: 10 },
              ]
            }
          }
        }
      }
    };

    expect(value).toEqual(dataFiltered);
  });

  test('should rename keys using aliases', () => {
    const value = dql(data, { keep: true })`
      test {
        test2 {
          test3 {
            test4 {
              test5Changed: test5
            }
          }
        }
      }`;

    const dataFiltered = {
      test: {
        test2: {
          test3: {
            test4: {
              test5Changed: 10
            }
          }
        }
      }
    };

    expect(value).toEqual(dataFiltered);
  });

  test('should rename keys using aliases and getting keys', () => {
    const value = dql(data, { keep: true })`
      test {
        test2 {
          test3 {
            test4 {
               newBox: box(age: 10) {
                  name,
                  age
               }
            }
          }
        }
      }`;

    const dataFiltered = {
      test: {
        test2: {
          test3: {
            test4: {
              newBox: [
                { name: { full: true }, age: 10 },
              ]
            }
          }
        }
      }
    };

    expect(value).toEqual(dataFiltered);
  });

  test('should work with children', () => {
    const data = {
      main: {
        items: [{
          something: 'yes',
          cakes: 'yes2',
        }]
      },
      breadcrumbs: [
        {
          "name": "Homepage",
          "url": "//www.blah.com/"
        }
      ],
      regular: {
        hi: 'hmm',
        bye: 'hmm2',
        something: {
          yes: 'ohyes',
        }
      },
      "debate_only": false,
      "featured": false,
    }

    const matchData = {
      main: {
        items: [{
          cakes: 'yes2',
        }]
      },
      breadcrumbs: [
        {
          "name": "Homepage",
        }
      ],
      regular: {
        bye: 'hmm2',
        something: {
          yes: 'ohyes',
        }
      },
      "debate_only": false,
      "featured": false,
    }

    // so the problem seems to be when you have a regular object
    // select with another select for a primitive property...
    const value = dql(data, { keep: true })`
      main {
        items {
          cakes
        }
      }
      breadcrumbs {
        name
      }
      regular {
        bye
        something {
          yes
        }
      }
      featured
      debate_only
    `;

    expect(value).toMatchObject(matchData);
  })
});
