/**
 * @class HelloWorld
 */
Class.create('HelloWorld', function()
{
    var salutation = "Hi ";
    var _name = "";

    return {
        /**
         * @Action
         * @function sayHi
         * @param name
         * @returns {HelloWorld}
         */
        sayHi : function(name)
        {
            _name = name;
            console.log(salutation + name);

            return this;
        },

        /**
         * @function sayHello
         * @returns {HelloWorld}
         */
        sayHello : function()
        {
            console.log("Hello " + _name);

            return this;
        }
    }
});