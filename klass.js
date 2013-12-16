(function(){

    var _create = function(name, fn)
    {
        if (global[name]) return;

        var klass = function() { (this['__construct'] && this['__construct'].apply(this, arguments)); }
        var attrs = fn();

        var docComment = getDocComment(fn);

        Object.defineProperty(klass.prototype, '__CLASS__', {value : "[Class :: " + name + "]"});

        Object.defineProperty(
            klass.prototype,
            'docComment',
            {
                writable : false,
                configurable : false,
                enumerable : false,
                value : docComment
            }
        );

        if (attrs)
        {
            'static;public'
                .replace(/[^;]+/g,
                function(type){
                    setCustomAttributes(klass, attrs, type);
                    delete attrs[type];
                }
            );
            setAttributes(klass.prototype, attrs);
        }

        defineAnnotations(klass, docComment);

        global[name] = klass;
    };

    function defineAnnotations(klass, docComment)
    {
        for(name in docComment)
        {
            if (docComment.hasOwnProperty(name))
            {
                var annotations = [];
                var list = docComment[name].match(/@(\w+)/g);
                if (list)
                {
                    list.forEach(function(item, i)
                    {
                        if (global[item.substr(1)])
                        {
                            annotations.push(new global[item.substr(1)]());
                            //@TODO : accept args
                        }
                    });
                }

                Object.defineProperty(klass.prototype[name], 'annotations', {value : annotations});
                Object.defineProperty(klass.prototype[name], 'hasAnnotation', {value : function(cls)
                {
                    for(var i = 0, l = this.annotations.length; i < l; i++)
                    {
                        if (this.annotations[i] instanceof cls)
                        {
                            return true;
                        }

                    }
                    return false;
                }});
            }
        }
    }

    function setCustomAttributes(klass,attrs,type)
    {
        var isStatic = type == 'static';
        setAttributes(isStatic ? klass : klass.prototype, attrs[type]);
    }

    function getDocComment(fn)
    {
        var docComment = {};
        var comments = fn.toString().match(/(\/\*([\s\S]*?)\*\/)|(([\s;])+\/\/(.*)$)/gmi);
        if (comments)
        {
            comments.forEach(function(comment,i)
            {
                var annotations = comment.match(/@(.+)/g);
                annotations.forEach(function(annotation)
                {
                    if (annotation.indexOf("@function") == 0 ||
                        annotation.indexOf("@var") == 0)
                    {
                        var name = annotation.split(" ")[1];
                        docComment[name] = comment.replace(/ +/g," ");
                    }
                });
            });
        }

        return docComment;
    }

    function setAttributes(obj, attrs)
    {
        for(var attr in attrs)
        {
            if (attrs.hasOwnProperty(attr))
            {
                Object.defineProperty(
                    obj,
                    attr,
                    {
                        writable : false,
                        configurable : false,
                        enumerable : true,
                        value : attrs[attr]
                    }
                );
            }
        }
    }

    _create('Class', function(){
        return {
            static :
            {
                create : _create
            },
            version : '0.0.1'
        };
    });
})();