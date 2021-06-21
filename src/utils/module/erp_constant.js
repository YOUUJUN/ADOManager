export default {

    //car_kind
    kind: function (val) {
        let result = '';
        switch (val) {
            case '11':
                result = '轿车（含MPV）';
                break;
            case '12':
                result = '面包车';
                break;
            case '13':
                result = '中型客车';
                break;
            case '14':
                result = '大型客车';
                break;
            case '15':
                result = '轻型载货汽车';
                break;
            case '16':
                result = '中型载货汽车';
                break;
            case '17':
                result = '重型载货汽车';
                break;
            case '18':
                result = '越野汽车(SUV)';
                break;
            case '19':
                result = '农用运输车';
                break;
            case '20':
                result = '牵引汽车';
                break;
            case '21':
                result = '挂车';
                break;
            case '22':
                result = '农用机械';
                break;
            case '25':
                result = '微型载货车';
                break;
            case '29':
                result = '摩托车';
                break;
            case '33':
                result = '电瓶车';
                break;
            default:
                result = '';
        }
        return result;
    },

    //bill_status
    car_flow: function (val) {
        let result = '';
        switch (val) {
            case 'd':
                result = '待进场';
                break;
            case '0':
                result = '车辆录入';
                break;
            case '1':
                result = '退回重录';
                break;
            case '2':
                result = '车辆验收';
                break;
            case '3':
                result = '待审批';
                break;
            case '32':
                result = '信息复核';
                break;
            case '4':
                result = '待预处理';
                break;

            case '52':
                result = '待评估';
                break;
            case '54':
                result = '精拆中';
                break;
            case '6':
                result = '商品状态';
                break;
            case '65':
                result = '销售中';
                break;
            case '68':
                result = '清场拆卸';
                break;
            case '7':
                result = '拆解中';
                break;
            case '9':
                result = '拆解完成';
                break;
            case 'a':
                result = '作废';
                break;
            case 'b':
                result = '调出';
                break;
            case 'c':
                result = '退档';
                break;
            case '02':
                result = '车辆提交';
                break;
            default:
                result = '';
        }
        return result;
    },

    //car_no_type
    carno: function (val) {
        let result = '';
        switch (val) {
            case '110':
                result = '小型号牌';
                break;
            case '112':
                result = '大型号牌';
                break;
            case '120':
                result = '使馆汽车';
                break;
            case '122':
                result = '领馆汽车';
                break;
            case '124':
                result = '境外汽车';
                break;
            case '126':
                result = '外籍汽车';
                break;
            case '130':
                result = '两轮摩托';
                break;
            case '132':
                result = '轻便摩托';
                break;
            case '133':
                result = '使馆摩托车';
                break;
            case '135':
                result = '领馆摩托车';
                break;
            case '137':
                result = '境外摩托车';
                break;
            case '139':
                result = '外籍摩托';
                break;
            case '141':
                result = '农用汽车';
                break;
            case '142':
                result = '拖拉机';
                break;
            case '143':
                result = '挂车';
                break;
            case '151':
                result = '教练汽车';
                break;
            case '152':
                result = '教练摩托车';
                break;
            case '153':
                result = '试验汽车';
                break;
            case '154':
                result = '试验摩托车';
                break;
            case '161':
                result = '临时入境汽车';
                break;
            case '162':
                result = '临时入境摩托车';
                break;
            case '163':
                result = '临时行使车';
                break;
            case '171':
                result = '警用汽车';
                break;
            case '172':
                result = '警用摩托车';
                break;
            case '180':
                result = '原农机号牌';
                break;
            case '191':
                result = '香港入出境车';
                break;
            case '192':
                result = '澳门入出境车';
                break;
            default:
                result = '';
        }
        return result;
    },

    sale_flow: function (val) {
        let result = '';
        switch (val) {
            case '2':
                result = '待审核';
                break;
            case '6':
                result = '待收款';
                break;
            case '9':
                result = '完成';
                break;
            case 'a':
                result = '作废';
                break;
            default:
                result = '待审核';
        }
        return result;

    },

    split_flow: function (val) {
        var result = '';
        switch (val) {
            case '2':
                result = '待审核';
                break;
            case '6':
                result = '待确认';
                break;
            case '9':
                result = '完成';
                break;
            case 'a':
                result = '作废';
                break;
            default:
                result = '待审核';
        }
        return result;
    },

    store_flow: function (val) {
        var result = '';
        switch (val) {
            case '2':
                result = '待入库';
                break;
            case '6':
                result = '入库确认';
                break;
            case '9':
                result = '入库完成';
                break;
            case 'a':
                result = '作废';
                break;
            default :
                result = '待入库';
        }
        return result;
    }
}
