var xApp = require('x-app');

describe('x-app feature', function() {
    
    it('should expose a "run" API', function() {
        expect(xApp).to.have.key('run');
    });
    
    it('should append content', function() {
        var targetEl = document.createElement('div');
        var stub = sinon.stub(document, 'querySelector', function() {
            stub.restore();
            return targetEl;
        });
        xApp.run();
        expect(targetEl.innerHTML.length).to.be.above(0);
    });
    
    it('should fail silently', function() {
        var stub = sinon.stub(document, 'querySelector', function() {
            stub.restore();
            return null;
        });
        
        expect(function() {
            xApp.run();
        }).to.not.throw();
    });
    
});