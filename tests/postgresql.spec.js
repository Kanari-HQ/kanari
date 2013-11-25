describe("PostgreSQL", function() {
    it("is there a server running", function(next) {
        var pg = require('pg').native;
        var dbUrl = 'tcp://nathan@localhost:5432/kanari_development'
        pg.connect(dbUrl, function(err, db) {
            expect(err).toBe(null);
            next();
        });
    });
});