var BaseController = require("../controllers/Base");
describe("Base controller", function(){
    it("should have a method extend which returns a child instance", function(next){
        expect(BaseController.extend).toBeDefined();
        var child = BaseController.extend({ name: "my child controller"});
        expect(child.run).toBeDefined();
        expect(child.name).toBe("my child controller");
        next();
    });
    if("should be able to create different childs", function(next){
        var childA = BaseController.extend({ name: "childA", customProperty: 'value'});
        var childB = BaseController.extend({ name: "childB" });
        expect(childA.name).not.toBe(childB.name);
        expect(childB.customProperty).not.toBeDefined();
    });
});