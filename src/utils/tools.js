/*
* Write By YOUJUN(柯涵);
*/


const tools = {

    /*---构造函数继承(空对象继承)---*/

    fExtend: function (Child, Parent) {
        var F = function () {
        };
        F.prototype = Parent.prototype;
        Child.prototype = new F();
        Child.prototype.constructor = Child;
        Child.uber = Parent.prototype; //在子对象上设置通道，直接调用父对象的方法;
    },


    /*---构造函数继承(拷贝继承)---*/

    copyExtend: function (Child, Parent) {
        var p = Parent.prototype;
        var c = Child.prototype;
        for (var i in p) {
            c[i] = p[i];
        }

        c.uber = p;
    },


    /*---对象继承(深拷贝继承)---*/

    deepCopy: function (Child, Parent) {
        var Child = Child || {};
        for (var i in Parent) {
            if (typeof Parent[i] === "object") {
                Child[i] = (Parent[i].constructor === Array) ? [] : {};
                this.deepCopy(Parent[i], Child[i]);
            } else {
                Child[i] = Parent[i];
            }
        }

        return Child;
    },


    /*---防抖与节流---*/
    /*
    * 防止指定函数多次调用。当一直触发指定函数时，触发间隔小于指定时间，
    * 防抖方法下调用一次;
    * 节流方法下每隔一定时间调用一次;
    */

    /*---防抖(debounce)---*/
    /**
     *
     * 所谓防抖，就是指触发事件后在 n 秒内函数只能执行一次，如果在 n 秒内又触发了事件，则会重新计算函数执行时间。
     *
     * params :
     *
     *func : 需要进行防抖处理的函数；
     * wait : 指定时间间隔；
     *immediate : 指定是否立即执行函数
     *
     * */


    debunce: function (func, wait, immediate) {
        var timeout;

        if (immediate === undefined) {
            immediate = true;
        }

        return function () {
            var context = this;
            var args = arguments;

            if (timeout) {
                clearTimeout(timeout);
            }

            if (immediate) {
                var callNow = !timeout;
                timeout = setTimeout(function () {
                    timeout = null;
                }, wait);

                if (callNow) {
                    func.apply(context, args);
                }
            } else {
                timeout = setTimeout(function () {
                    func.apply(context, args);
                }, wait);
            }
        }
    },

    /*---节流(throttle)---*/
    /**
     *
     * 所谓节流，就是指连续触发事件但是在 n 秒中只执行一次函数。
     *
     * params :
     *
     *func : 需要进行节流处理的函数；
     * wait : 指定时间间隔；
     *type : 1 表示时间戳版, 2 表示定时器版
     *
     * */

    throttle: function (func, wait, type) {
        type = type || 1;

        // 使用 == 兼容字符串;
        if (type == 1) {
            var previous = 0;
        } else if (type == 2) {
            var timeout;
        }

        return function () {
            var context = this;
            var args = arguments;
            if (type == 1) {
                var now = Date.now();

                if (now - previous > wait) {
                    func.apply(context, args);
                    previous = now;
                }
            } else if (type == 2) {
                if (!timeout) {
                    timeout = setTimeout(function () {
                        timeout = null;
                        func.apply(context, args);
                    }, wait);
                }
            }
        }
    },

    /*---sleep函数---*/

    sleep : function(ms) {

        var start = Date.now();
        var expire = start + ms;

        while (Date.now() < expire) ;

        return;

    },




    /*---Array---*/
    /*---判断一个对象是否为数组---*/

    ifArray: function (target) {
        if (Array.isArray) {
            return Array.isArray(target);
        }

        return Object.prototype.toString.call(target) === "[object Array]";
    },


    /*---去除指定数组相同值得项---*/
    /*
    * 不改变数组，返回新数组
    *
    * */

    delSameItemOf: function (targetArr) {
        var arr = new Array();
        for (var i = 0; i < targetArr.length; i++) {
            if (arr.indexOf(this[i]) == -1) {
                arr.push(this[i]);
            }
        }
        return arr;
    },


    /*---处理对象的数组，取得相同的属性值组成新数组并返回---*/
    /*
    * 不改变数组，返回新数组
    *
    * */

    groupBy: function (arr, prop) {
        return arr.reduce(function (groups, item) {
            var val = item[prop];
            groups[val] = groups[val] || [];
            groups[val].push(item);
            return groups;
        }, {});
    },


    /*---处理数组,返回扁平化后的数组---*/
    /*
    * 不改变数组，返回新数组
    *
    * */

    flattenArray : function (arr, newArr = []) {
        for(let item of arr){
            if(Array.isArray(item)){
                flattenArray(item, newArr);
            }else{
                newArr.push(item);
            }
        }
        return newArr;
    },



    /*---Number---*/
    /*---比较浮点值是否相等---*/

    contrastFloat : function(floatA, floatB){
        return Math.abs(floatA - floatB)<Number.EPSILON;
    },






    /*---DOM操作---*/
    /*---给指定元素添加类(兼容IE)---*/
    /*
    * classList可以为数组，空格分隔字符串
    *
    * */

    addClass: function (element, classList) {
        var classArr = classList || [];
        if (this.ifArray(classList)) {
            classArr = classList;
        } else {
            classArr = classList.split(" ");
        }

        for (var i = 0; i < classArr.length; i++) {
            var className = classArr[i];
            if (className) {
                if (element.classList) {
                    element.classList.add(className);
                } else {
                    if (!new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className)) {
                        element.className += ' ' + className;
                    }
                }
            }
        }
    },


    /*---给指定元素删除类(兼容IE)---*/
    /*
    * classList可以为数组，空格分隔字符串
    *
    * */

    removeClass: function (element, classList) {
        var classArr = classList || [];
        if (this.ifArray(classList)) {
            classArr = classList;
        } else {
            classArr = classList.split(" ");
        }

        for (var i = 0; i < classArr.length; i++) {
            var className = classArr[i];
            if (className) {
                if (element.classList) {
                    element.classList.remove(className);
                } else {
                    element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
                }
            }
        }
    },


    /*---判断指定元素是否有指定类(兼容IE)---*/
    /*
    * classList可以为数组，空格分隔字符串
    *
    * */





    /*---DOM操作，深度遍历---*/
    /*
    * 递归遍历
    * 遍历树性DOM结构
    *
    * */

    deepTraversal : (node, nodeList = []) => {
        if(node != null){
            nodeList.push(node);
            let children = node.children;
            for(let i=0;i<children.length;i++){
                deepTraversal(children[i], nodeList);
            }
        }
        return nodeList;
    },


    /*---DOM操作，深度遍历---*/
    /*
    * **非递归遍历
    * 遍历树性DOM结构
    *
    * */

    deepTraversal2 : (node) => {
        let stack = [];
        let nodes = [];
        if(node){
            stack.push(node);
        }

        while(stack.length){
            let item = stack.pop();
            let children = item.children;
            nodes.push(item);
            for(let i = children.length -1;i>=0;i--){
                stack.push(children[i]);
            }
        }

        return nodes;
    },


    /*---DOM操作，广度遍历---*/
    /*
    * **非递归遍历
    * 遍历树性DOM结构
    *
    * */

    widthTraversal : (node) => {
        let nodes = [];
        let stack = [];
        if(node){
            stack.push(node);
            while(stack.length){
                let item = stack.shift();
                let children = item.children;
                nodes.push(item);
                for(let i=0;i<children.length;i++){
                    stack.push(children[i]);
                }
            }
        }
        return nodes;
    },


    /**
     * 判断变量类型;
     *
     * 返回boolean
     *
     * item : 需要判断类型的变量
     * type : {
          array: 'Array',
          object: 'Object',
          function: 'Function',
          string: 'String',
          null: 'Null',
          undefined: 'Undefined',
          boolean: 'Boolean',
          number: 'Number'
        }
     *
     * */

    isTypeOf : (item, type) => {
        let map = {
            array: 'Array',
            object: 'Object',
            function: 'Function',
            string: 'String',
            null: 'Null',
            undefined: 'Undefined',
            boolean: 'Boolean',
            number: 'Number'
        }

        let stringType = Object.prototype.toString.call(item).slice(8, -1);

        return map[type] && stringType === map[type];
    },


    //better async func error capture;
    /*
    * async function func() {
            let [err, res] = await errorCaptured(asyncFunc)
            if (err) {
                //... 错误捕获
            }
            //...
        }
    *
    * */
    async errorCaptured(asyncFunc, ...params){
        try{
            console.log('params',params);
            let res = await asyncFunc(...params);
            return [null,res];
        }catch (e) {
            return [e, null];
        }
    }

};

export default tools;

let errorCaptured = tools.errorCaptured;
export {errorCaptured};







