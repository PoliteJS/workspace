/**
 * Specification tests for "hello-world" feature.
 * we certify it is a start-able feature!
 */

describe('Feature "hello-world"', function() {    
    it('should have a "start()" method', function() {
        expect(
            require('hello-world')
        ).to.has.property('start');
    });
    it('"start()" should be callable', function() {
        expect(
            require('hello-world').start
        ).to.be.a('function');
    });
});
