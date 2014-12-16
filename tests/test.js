var omcache = require('omcache');
var assert = require('assert');
var crypto = require('crypto');


function connect() {
    var addr = process.env['MC_HOST'] || '127.0.0.1:11211';
    return new omcache.OMCache(addr);
}

function test_string(prefix) {
    return prefix + crypto.randomBytes(8).toString('hex') + 'äТЕСТö';
}

describe('OMCache', function() {
    var omc = connect();

    function assertKeyValue(key, value, done) {
        omc.get(key, function(err, data) {
            assert.equal(data, value);
            return done(err);
        })
    }

    describe('#set()', function() {
        it('should set the value successfully', function(done) {
            var key = test_string('key');
            var value = test_string('value');
            omc.set(key, value, 123, function(err, data) {
                if (err) done(err);
                assertKeyValue(key, value, done);
            });
        })
    });

    describe('#get() missing', function() {
        it('should return Not found for a missing key', function() {
            omc.get(test_string('key'), function(err, data) {
                assert.equal(data, undefined);
                assert.strictEqual(err, 'Not found');
            });
        });
    });

    describe('#increment()', function() {
        it('should increment the value properly', function(done) {
            var key = test_string('key_incr');
            omc.set(key, 123, 900, function(err, data) {
                if (err) done(err);
                omc.increment(key, 22, function(){
                    assertKeyValue(key, 123 + 22, done);
                })
            })
        });
    });

    describe('#decrement()', function() {
        it('should decrement the value properly', function(done) {
            var key = test_string('key_decr');
            omc.set(key, 123, 900, function(err, data) {
                if (err) return done(err);
                omc.decrement(key, 22, function() {
                    assertKeyValue(key, 123 - 22, done);
                });
            });
        });
    });
});
