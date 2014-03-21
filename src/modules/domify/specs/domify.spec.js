
var domify = require('domify');

describe('domify', function() {
    it('should domify a paragraph', function() {
        expect(
            domify('<p>foo</p>').innerHTML
        ).to.equal('foo');
    });
    it('should parse "class" attribute', function() {
        expect(
            domify('<p class="querty">foo</p>').className
        ).to.equal('querty');
    });
});
