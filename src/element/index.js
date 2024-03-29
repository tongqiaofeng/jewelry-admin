// 导入自己需要的组件
import {
  Form,
  FormItem,
  Select,
  Option,
  Input,
  Button,
  Container,
  Header,
  Aside,
  Main,
  Backtop,
  Pagination,
  Dialog,
  Table,
  TableColumn,
  Switch,
  Cascader,
  Autocomplete,
  DatePicker,
  Tooltip,
  Row,
  Col,
  Tabs,
  TabPane,
  RadioGroup,
  Radio,
  Drawer,
  Timeline,
  TimelineItem,
  Carousel,
  CarouselItem,
  Popover,
  Checkbox,
  InputNumber,
  Collapse,
  CollapseItem,

  Message,
  Loading,
  MessageBox,
  Notification,
} from 'element-ui'
const element = {
  install: function (Vue) {
    Vue.use(Form)
    Vue.use(FormItem)
    Vue.use(Select)
    Vue.use(Option)
    Vue.use(Input)
    Vue.use(Button)
    Vue.use(Container)
    Vue.use(Header)
    Vue.use(Aside)
    Vue.use(Main)
    Vue.use(Backtop)
    Vue.use(Pagination)
    Vue.use(Dialog)
    Vue.use(Table)
    Vue.use(TableColumn)
    Vue.use(Switch)
    Vue.use(Cascader)
    Vue.use(Autocomplete)
    Vue.use(DatePicker)
    Vue.use(Tooltip)
    Vue.use(Row)
    Vue.use(Col)
    Vue.use(Tabs)
    Vue.use(TabPane)
    Vue.use(RadioGroup)
    Vue.use(Radio)
    Vue.use(Drawer)
    Vue.use(Timeline)
    Vue.use(TimelineItem)
    Vue.use(Carousel)
    Vue.use(CarouselItem)
    Vue.use(Popover)
    Vue.use(Checkbox)
    Vue.use(InputNumber)
    Vue.use(Collapse)
    Vue.use(CollapseItem)

    Vue.use(Loading.directive)

    Vue.prototype.$message = Message;
    Vue.prototype.$confirm = MessageBox.confirm;
    Vue.prototype.$alert = MessageBox.alert;
    Vue.prototype.$notify = Notification;
  }
}
export default element