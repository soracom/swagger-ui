'use strict';

describe('SwaggerUi.partials.signature tests', function () {
    var sut = SwaggerUi.partials.signature;
    var models = {
         'Pet': {
             'definition': {
                 'type': 'object',
                 'required': [ 'name', 'photoUrls' ],
                 'properties': {
                     'id': {
                         'type': 'integer',
                         'format': 'int64 '
                     },
                     'category': { '$ref': '#/definitions/Category' },
                     'name': {
                         'type': 'string',
                         'example': 'doggie'
                     },
                     'photoUrls': {
                         'type': 'array',
                         'xml': {
                             'name': 'photoUrl',
                             'wrapped':true
                         },
                         'items': { 'type': 'string' }
                     },
                     'tags': {
                         'type': 'array',
                         'xml': { 'name': 'tag', 'wrapped':true},
                         'items': { '$ref': '#/definitions/Tag' }
                     },
                     'status': {
                         'type': 'string',
                         'description': 'pet status in the store',
                         'enum':[ 'available', 'pending', 'sold' ]
                     }
                 },
                 'xml': { 'name': 'Pet' }
            },
             'name': 'Pet'
         },
         'Category': {
             'definition': {
                 'type': 'object',
                 'properties': {
                     'id': { 'type': 'integer', 'format': 'int64' },
                     'name': { 'type': 'string' }
                 },
                 'xml': { 'name': 'Category' }
             },
             'name': 'Category'
         },
         'Tag': {
             'definition': {
                 'type': 'object',
                 'properties': {
                     'id': { 'type': 'integer', 'format': 'int64' },
                     'name': { 'type': 'string' }
                 },
                 'xml': { 'name': 'Tag' }
             },
             'name': 'Tag'
        }
    };

    describe('method createSchemaXML', function () {
        var date = new Date(1).toISOString().split('T')[0];
        var dateTime = new Date(1).toISOString();

        describe('simple types with no xml property', function () {
            it('returns tag <tagname>string</tagname> when passing type string', function () {
                var name = 'tagname';
                var definition = {type: 'string'};

                expect(sut.createSchemaXML(name, definition, models)).to.equal('<tagname>string</tagname>');
            });

            it('returns tag <tagname>1</tagname> when passing type integer', function () {
                var name = 'tagname';
                var definition = {type: 'integer'};

                expect(sut.createSchemaXML(name, definition, models)).to.equal('<tagname>1</tagname>');
            });

            it('returns tag <tagname>1.1</tagname> when passing type number', function () {
                var name = 'tagname';
                var definition = {type: 'number'};

                expect(sut.createSchemaXML(name, definition, models)).to.equal('<tagname>1.1</tagname>');
            });

            it('returns tag <tagname>boolean</tagname> when passing type boolean', function () {
                var name = 'tagname';
                var definition = {type: 'boolean'};

                expect(sut.createSchemaXML(name, definition, models)).to.equal('<tagname>true</tagname>');
            });

            it('returns tag <tagname>' + date + '</tagname> when passing type string format date', function () {
                var name = 'tagname';
                var definition = {type: 'string', format: 'date'};

                expect(sut.createSchemaXML(name, definition, models)).to.equal('<tagname>' + date + '</tagname>');
            });

            it('returns tag <tagname>' + dateTime + '</tagname> when passing type string format date-time', function () {
                var name = 'tagname';
                var definition = {type: 'string', format: 'date-time'};

                expect(sut.createSchemaXML(name, definition, models)).to.equal('<tagname>' + dateTime + '</tagname>');
            });
        });

        describe('simple types with xml property', function () {
            it('returns tag <newtagname>string</newtagname> when passing type string and xml:{name: "newtagname"}', function () {
                var name = 'tagname';
                var definition = {
                    type: 'string',
                    xml: {
                        name: 'newtagname'
                    }
                };

                expect(sut.createSchemaXML(name, definition, models)).to.equal('<newtagname>string</newtagname>');
            });

            it('returns tag <test:newtagname>string</test:newtagname> when passing type string and xml:{name: "newtagname", prefix:"test"}', function () {
                var name = 'tagname';
                var definition = {
                    type: 'string',
                    xml: {
                        name: 'newtagname',
                        prefix: 'test'
                    }
                };

                expect(sut.createSchemaXML(name, definition, models)).to.equal('<test:newtagname>string</test:newtagname>');
            });

            it('returns tag <test:tagname>string</test:tagname> when passing type string and xml:{name: "newtagname", prefix:"test"}', function () {
                var name = 'tagname';
                var definition = {
                    type: 'string',
                    xml: {
                        prefix: 'test'
                    }
                };

                expect(sut.createSchemaXML(name, definition, models)).to.equal('<test:tagname>string</test:tagname>');
            });

            it('returns tag <test:tagname >string</test:tagname> when passing type string and xml:{"namespace": "http://swagger.io/schema/sample", "prefix": "sample"}', function () {
                var name = 'name';
                var definition = {
                    type: 'string',
                    xml: {
                        namespace: 'http://swagger.io/schema/sample',
                        prefix: 'sample'
                    }
                };

                expect(sut.createSchemaXML(name, definition, models)).to.equal('<sample:name xlmns:sample="http://swagger.io/schema/sample">string</sample:name>');
            });

            it('returns tag <test:tagname >string</test:tagname> when passing type string and xml:{"namespace": "http://swagger.io/schema/sample"}', function () {
                var name = 'name';
                var definition = {
                    type: 'string',
                    xml: {
                        namespace: 'http://swagger.io/schema/sample'
                    }
                };

                expect(sut.createSchemaXML(name, definition, models)).to.equal('<name xlmns="http://swagger.io/schema/sample">string</name>');
            });
        });

        describe('array', function () {
            it('returns tag <tagname>string</tagname><tagname>string</tagname> when passing string items', function () {
                var expected = '<tagname>string</tagname><tagname>string</tagname>';
                var name = 'tagname';
                var definition = {
                    type: 'array',
                    items: {
                        type: 'string'
                    }
                };

                expect(sut.createSchemaXML(name, definition, models)).to.equal(expected);
            });

            it('returns tag <animal>string</animal><animal>string</animal> when passing string items with name', function () {
                var expected = '<animal>string</animal><animal>string</animal>';
                var name = 'animals';
                var definition = {
                    type: 'array',
                    items: {
                        type: 'string',
                        xml: {
                            name: 'animal'
                        }
                    }
                };

                expect(sut.createSchemaXML(name, definition, models)).to.equal(expected);
            });

            it('returns tag <animals><animal>string</animal><animal>string</animal></animals> when passing string items with name', function () {
                var expected = '<animals><animal>string</animal><animal>string</animal></animals>';
                var name = 'animals';
                var definition = {
                    type: 'array',
                    items: {
                        type: 'string',
                        xml: {
                            name: 'animal'
                        }
                    },
                    xml: {
                        wrapped: true
                    }
                };

                expect(sut.createSchemaXML(name, definition, models)).to.equal(expected);
            });

            it('returns tag <aliens><animal>string</animal><animal>string</animal></aliens> when passing string items with name and {wrapped: true}', function () {
                var expected = '<aliens><animal>string</animal><animal>string</animal></aliens>';
                var name = 'animals';
                var definition = {
                    type: 'array',
                    items: {
                        type: 'string',
                        xml: {
                            name: 'animal'
                        }
                    },
                    xml: {
                        wrapped: true,
                        name: 'aliens'
                    }
                };

                expect(sut.createSchemaXML(name, definition, models)).to.equal(expected);
            });

            it('return correct nested wrapped array', function () {
                var expected = '<aliens><cat>string</cat><cat>string</cat><cat>string</cat><cat>string</cat></aliens>';
                var name = 'animals';
                var definition = {
                    type: 'array',
                    items: {
                        type: 'array',
                        items: {
                           type: 'string'
                        },
                        xml: {
                            name: 'cat'
                        }
                    },
                    xml: {
                        wrapped: true,
                        name: 'aliens'
                    }
                };

                expect(sut.createSchemaXML(name, definition, models)).to.equal(expected);
            });

            it('return correct nested wrapped array', function () {
                var expected = '<aliens>' +
                    '<cats><cat>string</cat><cat>string</cat></cats>' +
                    '<cats><cat>string</cat><cat>string</cat></cats>' +
                    '</aliens>';
                var name = 'animals';
                var definition = {
                    type: 'array',
                    items: {
                        type: 'array',
                        items: {
                            type: 'string',
                            xml: {
                                name: 'cat'
                            }
                        },
                        xml: {
                            name: 'cats',
                            wrapped: true
                        }
                    },
                    xml: {
                        wrapped: true,
                        name: 'aliens'
                    }
                };

                expect(sut.createSchemaXML(name, definition, models)).to.equal(expected);
            });
        });

        describe('object', function () {
            it('returns object with 2 properties', function () {
                var expected = '<aliens>' +
                    '<alien>string</alien>' +
                    '<cat>1</cat>' +
                    '</aliens>';
                var name = 'animals';
                var definition = {
                    type: 'object',
                    properties: {
                        alien: {
                            type: 'string'
                        },
                        cat: {
                            type: 'integer'
                        }
                    },
                    xml: {
                        name: 'aliens'
                    }
                };

                expect(sut.createSchemaXML(name, definition, models)).to.equal(expected);
            });

            it('returns object with integer property and array property', function () {
                var expected = '<animals>' +
                    '<aliens>string</aliens>' +
                    '<aliens>string</aliens>' +
                    '<cat>1</cat>' +
                    '</animals>';
                var name = 'animals';
                var definition = {
                    type: 'object',
                    properties: {
                        aliens: {
                            type: 'array',
                            items: {
                                type: 'string'
                            }
                        },
                        cat: {
                            type: 'integer'
                        }
                    },
                    xml: {
                        name: 'animals'
                    }
                };

                expect(sut.createSchemaXML(name, definition, models)).to.equal(expected);
            });

            it('returns object with integer property and array property', function () {
                var expected = '<animals>' +
                    '<aliens><alien>string</alien><alien>string</alien></aliens>' +
                    '<cat>1</cat>' +
                    '</animals>';
                var name = 'animals';
                var definition = {
                    type: 'object',
                    properties: {
                        aliens: {
                            type: 'array',
                            items: {
                                type: 'string',
                                xml: {
                                    name: 'alien'
                                }
                            },
                            xml: {
                                wrapped: true
                            }
                        },
                        cat: {
                            type: 'integer'
                        }
                    },
                    xml: {
                        name: 'animals'
                    }
                };

                expect(sut.createSchemaXML(name, definition, models)).to.equal(expected);
            });

            it('returns nested objects', function () {
                var expected = '<animals>' +
                        '<aliens>' +
                            '<alien>string</alien>' +
                        '</aliens>' +
                        '<cat>string</cat>' +
                    '</animals>';
                var name = 'animals';
                var definition = {
                    type: 'object',
                    properties: {
                        aliens: {
                            type: 'object',
                            properties: {
                                alien: {
                                    type: 'string',
                                    xml: {
                                        name: 'alien'
                                    }
                                }
                            }
                        },
                        cat: {
                            type: 'string'
                        }
                    },
                    xml: {
                        name: 'animals'
                    }
                };

                expect(sut.createSchemaXML(name, definition, models)).to.equal(expected);
            });

            it('returns object with no readonly fields for parameter', function () {
                var expected = '<animals>' +
                    '<id>1</id>'+
                    '</animals>';
                var name = 'animals';
                var definition = {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer'
                        },
                        cat: {
                            readOnly: true,
                            type: 'string'
                        }
                    },
                    xml: {
                        name: 'animals'
                    }
                };

                expect(sut.createSchemaXML(name, definition, models, true)).to.equal(expected);
            });

            it('returns object with passed parameter as attribute', function () {
                var expected = '<animals id="1">' +
                    '<dog>string</dog>' +
                    '</animals>';
                var name = 'animals';
                var definition = {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            xml: {
                                attribute: true
                            }
                        },
                        dog: {
                            type: 'string'
                        }
                    },
                    xml: {
                        name: 'animals'
                    }
                };

                expect(sut.createSchemaXML(name, definition, models, true)).to.equal(expected);
            });
        });

        describe('schema is in definitions', function () {
            
            it('returns array of Tags wrapped into Tags', function () {
                var expected = '<Tags>' +
                    '<Tag><id>1</id><name>string</name></Tag>' +
                    '<Tag><id>1</id><name>string</name></Tag>' +
                    '</Tags>';
                var schema = {
                    type: 'array',
                    items: {
                        $ref: '#/definitions/Tag'
                    },
                    xml: {
                        name: 'Tags',
                        wrapped: true
                    }
                };

                expect(sut.createSchemaXML('', schema, models)).to.equal(expected);
            });

            it('returns Object with properties Pet and name', function () {
                var expected = '<Pet>' +
                    '<id>1</id>' +
                    '<Category>' +
                        '<id>1</id>' +
                        '<name>string</name>' +
                    '</Category>' +
                    '<name>doggie</name>' +
                    '<photoUrl>' +
                        '<photoUrl>string</photoUrl>' +
                        '<photoUrl>string</photoUrl>' +
                    '</photoUrl>' +
                    '<tag>' +
                        '<Tag><id>1</id><name>string</name></Tag>' +
                        '<Tag><id>1</id><name>string</name></Tag>' +
                    '</tag>' +
                    '<status>available</status>' +
                    '</Pet>';
                var schema = {
                    $ref: '#/definitions/Pet'
                };

                expect(sut.createSchemaXML('', schema, models)).to.equal(expected);
            });
        });
    });
});
