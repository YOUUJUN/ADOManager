/**
 *
 *
 * @param item 判断item类型
 * @param type
 * @returns {*|boolean}
 */

export function isTypeOf (item, type){
    const map = {
        array: 'Array',
        object: 'Object',
        function: 'Function',
        string: 'String',
        null: 'Null',
        undefined: 'Undefined',
        boolean: 'Boolean',
        number: 'Number'
    };

    let stringType = Object.prototype.toString.call(item).slice(8, -1);
    return map[type] && stringType === map[type];
}

/**
 *
 * @param target   被拷贝子对象
 * @param source   继承父对象
 * @param overwrite     是否覆盖子对象已有属性
 * @param isdeep    是否深度继承
 * @returns {any}
 *
 */

export function extend(target = {}, source ={}, overwrite = true, isdeep = true) {

    for(let key in source){
        if(isdeep && typeof source[key] === 'object'){
            if((target.hasOwnProperty(key) && overwrite) || !target.hasOwnProperty(key)){
                target[key] = isTypeOf(source[key], 'array') ? [] : {};
                extend(target[key], source[key]);
            }
        }else if(!isdeep || (isdeep && !(typeof source[key] === 'object'))){
            if((target.hasOwnProperty(key) && overwrite) || !target.hasOwnProperty(key)){
                target[key] = source[key];
            }
        }
    }


    return target;
}


