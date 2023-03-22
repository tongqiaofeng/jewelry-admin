import {
  tagListPort,
  seriesListPort,
  customerTypeListPort,
} from "_req/api/common";
import { groupListPort } from "_req/api/admin";

export const labelMixins = {
  data() {
    return {
      productLabelList: [],
    };
  },
  created() {
    this.getLabelList();
  },
  methods: {
    // 获取标签列表
    getLabelList() {
      tagListPort().then((res) => {
        console.log("标签列表");
        console.log(res);
        this.productLabelList = res.data.data;
      });
    },
  },
};

export const brandJointlyMixins = {
  data() {
    return {
      brandSeriesList: [],
      jointlyList: [],
    };
  },
  created() {
    this.getBrandAndJointly();
  },
  methods: {
    // 获取品牌、联名系列列表
    getBrandAndJointly() {
      seriesListPort().then((res) => {
        console.log("品牌联名系列");
        console.log(res);
        this.brandSeriesList = res.data.data.brandSeriesList;
        this.jointlyList = res.data.data.coBrandedSeriesList;
      });
    },
  },
};

export const customerTypeMixins = {
  data() {
    return {
      customerTypeList: [],
    };
  },
  created() {
    this.getCustomerTypeList();
  },
  methods: {
    // 获取顾客类型列表
    getCustomerTypeList() {
      this.customerTypeList = [];
      customerTypeListPort().then((res) => {
        console.log("顾客类型列表");
        console.log(res);
        let list = res.data.data;
        for (const item of list) {
          this.customerTypeList.push({
            name: item,
          });
        }
      });
    },
    // 顾客类型
    customerTypeQuery(queryString, cb) {
      let restaurants = this.customerTypeList;

      for (let items of restaurants) {
        items.value = items.name;
      }

      let results = queryString
        ? restaurants.filter(this.createModelFilter(queryString))
        : restaurants;
      console.log("匹配", results);

      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createModelFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    handleModelSelect(item) {
      console.log("选中结果", item);
      this.deliveryData.customerType = item.name;
    },
  },
};

export const groupMixins = {
  data() {
    return {
      groupList: [],
    };
  },
  created() {
    this.getGroupList();
  },
  methods: {
    // 获取销售员列表
    getGroupList() {
      this.groupList = [];
      groupListPort().then((res) => {
        console.log("销售组列表");
        console.log(res);

        let list = res.data.data;
        for (const item of list) {
          if (item !== "全部") {
            this.groupList.push({
              name: item,
            });
          }
        }
      });
    },
    // 销售组
    groupQuery(queryString, cb) {
      let restaurants = this.groupList;

      for (let items of restaurants) {
        items.value = items.name;
      }

      let results = queryString
        ? restaurants.filter(this.createGroupFilter(queryString))
        : restaurants;
      console.log("匹配", results);

      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createGroupFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    handleGroupSelect(item) {
      console.log("选中结果", item);
      if (this.deliveryData) {
        this.deliveryData.group = item.name;
      }
      if (this.materialUpdateMsg) {
        this.materialUpdateMsg.group = item.name;
      }
      if (this.productUpdateMsg) {
        this.productUpdateMsg.group = item.name;
      }
    },
  },
};
