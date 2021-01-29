export default {
    /* 导航菜单是否折叠 */
    isCollapse: false,
    /* 面包屑导航列表 */
    tagsList: [],
    prviewList: {}, //权限
    menuList: [], //菜单
    // 组件缓存对象
    include: [],
    //时间选择器,赛选条件
    timePicker: {
        //快捷选项
        pickerOptions: {
            shortcuts: [{
                text: "最近一周",
                onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit("pick", [start, end]);
                },
            },
            {
                text: "最近一个月",
                onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit("pick", [start, end]);
                },
            },
            {
                text: "最近三个月",
                onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit("pick", [start, end]);
                },
            },
            ],
        },
    },
    tagsHeight: 0,
    //tags高度
    tableHeight:window.innerHeight,
    //分页数据
    page: {
        // 默认显示第几页
        page: 1,
        // 总条数，根据接口获取数据长度
        totalCount: 0,
        // 默认每页显示的条数（可修改）
        rows: 20,
    },
    loading: false,//加载
}
