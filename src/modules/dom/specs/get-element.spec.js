/**
 * DOM Library
 * get-element unit tests
 */

var getElement = require('dom/get-element');

describe('DOM::get-element', function() {
    
    var documentQuerySelectorStub;
    var documentGetElementByIdStub;
    
    before(function() {
        documentQuerySelectorStub = sinon.stub(document, 'querySelector', function() {
            return document.createElement('div');
        });
        documentGetElementByIdStub = sinon.stub(document, 'getElementById', function() {
            return document.createElement('div');
        });
    });
    
    after(function() {
        documentQuerySelectorStub.restore();
    });
    
    describe('query by selector', function() {
        it('should return a DOM element', function() {
            expect(
                getElement('body')
            ).to.have.property('tagName');
        });
    });
    
    describe('query by id', function() {
        it('should return a DOM element', function() {
            expect(
                getElement('#foo')
            ).to.have.property('tagName');
        });
    });

});