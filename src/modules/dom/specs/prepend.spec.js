
var prepend = require('dom/prepend');

describe('DOM::prepend', function() {
    
    var domTarget;
    
    beforeEach(function() {
        domTarget = document.createElement('div');
        domTarget.innerHTML = '<p>pre</p>';
    });
    
    it('should insert a string', function() {
        prepend(domTarget, '<p>aaa</p>');
        expect(domTarget.innerHTML).to.contain('aaa');
    });
    
    it('should append a string AT THE BEGINNING of the content', function() {
        prepend(domTarget, '<p>aaa</p>');
        expect(
            domTarget.innerHTML.indexOf('pre')
        ).to.be.greaterThan(domTarget.innerHTML.indexOf('aaa'));
    });

});