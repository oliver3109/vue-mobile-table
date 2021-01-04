// * Component Name:
//   complx-table
//
// * Props:
//      1. column: Array<any>
//      2. list: Array<any>

(function (Vue) {
  var scroller = null;
  var Selector = "";
  var createIScroller = function (selector) {
    Selector = selector;
    scroller = new IScroll(Selector, {
      preventDefault: false,
      probeType: 3,
      mouseWheel: true,
      scrollX: true,
      scrollY: true,
      lockDirection: false,
      snap: false,
      scrollbars: false,
      freeScroll: true,
      deceleration: 0.0001,
      disableMouse: true,
      disablePointer: true,
      disableTouch: false,
      eventPassthrough: false,
      bounce: false,
    });
    scroller.on("scroll", updatePosition);
    scroller.on("scrollEnd", updatePosition);
    scroller.on("beforeScrollStart", function () {
      scroller.refresh();
    });

    function updatePosition() {
      let frozenCols = document.querySelectorAll(
        selector + " table tr td.cols"
      );
      let frozenRows = document.querySelectorAll(
        selector + " table tr th.rows"
      );
      let frozenCrosses = document.querySelectorAll(
        selector + " table tr th.cross"
      );
      for (let i = 0; i < frozenCols.length; i++) {
        frozenCols[i].style.transform =
          "translate(" + -1 * this.x + "px, 0px) translateZ(0px)";
      }
      for (let i = 0; i < frozenRows.length; i++) {
        frozenRows[i].style.transform =
          "translate(0px, " + -1 * this.y + "px) translateZ(0px)";
      }
      for (let i = 0; i < frozenCrosses.length; i++) {
        frozenCrosses[i].style.transform =
          "translate(" +
          -1 * this.x +
          "px," +
          -1 * this.y +
          "px) translateZ(0px)";
      }
    }

    return scroller;
  };

  var template = `
  <div class="pages-tables " id="pages-tables">
  <div class="waterMask" id="watermark"></div>
  <div class="rolling-table meal-table" ref="tableBox" :style="{height: maxHeight + 'px'}">
      <table class="table" id="table" cellpadding="0" cellspacing="0" ref="rollingTable">
          <tr v-for="(x,i) in xList" :key="i">
              <th class="rows " :class="{'cross': index == 0 && i == 0}" v-for="(l,index) in x" :key="index" :colspan="l.colspan" :rowspan="l.rowspan">{{l.name}}</th>
          </tr>
          <tr v-for="(l,i) in yList" :key="i + 'a'" class="row">
              <template v-for="(x, xKey) in xField">
                <td v-for="(ll,yKey) in l" :key="yKey" v-if="toLowerCase(x) === toLowerCase(yKey)" :class="{'cols': yKey == xField[0]}">
                  <div class="td-content">
                    <slot :name="yKey | toLowerCase" :row="yList[i]" :value="yList[i][yKey]"></slot>
                  </div>
                </td> 
              </template>
          </tr>
          <tr></tr>
      </table>
  </div>
</div>
  `;

  console.log("registed complx-table success!");

  var config = {
    name: "complx-table",
    template: template,
    props: {
      column: {
        type: Array,
        default: () => [],
      },
      list: {
        type: Array,
        default: () => [],
      },
    },
    filters: {
      toLowerCase(v) {
        return v.toLowerCase();
      },
    },
    computed: {
      xList: function () {
        return this.column;
      },
      xField: function () {
        if (this.list.length > 0) return Object.keys(this.list[0]);
        return [];
      },
      yList: function () {
        return this.list;
      },
    },
    methods: {
      toLowerCase(v) {
        return v.toLowerCase();
      },
    },
    data() {
      return {
        maxHeight: "100%",
        scroll: {
          scroller: null,
        },
      };
    },
    mounted() {
      this.maxHeight = window.screen.height;
      this.scroll.scroller = createIScroller(".meal-table");
    },
  };

  Vue.component("complx-table", config);
})(Vue);
