
var append = require('dom/append');

describe('DOM::append', function() {
    
    var domTarget;
    
    beforeEach(function() {
        domTarget = document.createElement('div');
        domTarget.innerHTML = '<p>pre</p>';
    });
    
    it('should insert a string', function() {
        append(domTarget, '<p>aaa</p>');
        expect(domTarget.innerHTML).to.contain('aaa');
    });
    
    it('should append a string AT THE END of the content', function() {
        append(domTarget, '<p>aaa</p>');
        expect(
            domTarget.innerHTML.indexOf('pre')
        ).to.be.lessThan(domTarget.innerHTML.indexOf('aaa'));
    });

});