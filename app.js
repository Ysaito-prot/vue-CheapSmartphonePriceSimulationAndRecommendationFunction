window.onload = function () {
  new Vue({
    el: "#app",
    data: {
      trans_name: "next",
      current_slide: 0,
      qA: [],
      prices: [],
      questionAnswer: "",
      keepAns: [],
      keepPri: [],
      active: false,
      isActive: false,
      inactiveResult: true,
      activeResult: false,
    },
    created: async function () {
      const res = await fetch("./asset/qA.json");
      const users = await res.json();
      this.qA = users;
      const res1 = await fetch("./asset/price.json");
      const pricesSub = await res1.json();
      this.prices = pricesSub;
      console.log(this.qA);
      console.log(this.prices.fixedPrice.length);
    },
    methods: {
      next: function (x) {
        this.trans_name = "next";
        this.current_slide = x;
      },
      prevQ: function () {
        this.trans_name = "prev";
        this.current_slide = this.keepAns[this.keepAns.length - 1].sliderNum;
        this.keepAns.pop();
        // console.log(this.keepAns);
      },
      saveAns: function (x, y) {
        this.keepAns.push({ sliderNum: x, ans: y });
        this.questionAnswer = "";
        console.log(this.keepAns);
        return this.keepAns;
      },
      totalOutput: function () {
        this.keepPri = [];
        if (this.keepAns[0].ans === "必要") {
          for (i = 0; i < this.prices.fixedPrice.length; i++) {
            if (this.keepAns[2].ans === this.prices.fixedPrice[i][0]) {
              this.keepPri.push(this.prices.fixedPrice[i][1]);
            }
          }
          for (i = 0; i < this.prices.SIMeSIM.length; i++) {
            if (this.keepAns[3].ans === this.prices.SIMeSIM[i][0]) {
              this.keepPri.push(this.prices.SIMeSIM[i][1]);
              this.resultCap = this.prices.SIMeSIM[i][2];
            }
          }
        }
        if (
          this.keepAns[0].ans === "不要" &&
          this.keepAns[1].ans === "SMSを使う"
        ) {
          for (i = 0; i < this.prices.SMS.length; i++) {
            if (this.keepAns[2].ans === this.prices.SMS[i][0]) {
              this.keepPri.push(this.prices.SMS[i][1]);
            }
          }
        }
        if (
          this.keepAns[0].ans === "不要" &&
          this.keepAns[2].ans === "データeSIMを使う"
        ) {
          for (i = 0; i < this.prices.dataeSIM.length; i++) {
            if (this.keepAns[3].ans === this.prices.dataeSIM[i][0]) {
              this.keepPri.push(this.prices.dataeSIM[i][1]);
              this.resultCap = this.prices.dataeSIM[i][2];
            }
          }
        }
        if (
          this.keepAns[0].ans === "不要" &&
          this.keepAns[2].ans === "データeSIMは使わない"
        ) {
          for (i = 0; i < this.prices.notDataeSIM.length; i++) {
            if (this.keepAns[3].ans === this.prices.notDataeSIM[i][0]) {
              this.keepPri.push(this.prices.notDataeSIM[i][1]);
              this.resultCap = this.prices.notDataeSIM[i][2];
            }
          }
        }
        console.log(this.keepPri);
        let totalSum = this.keepPri.reduce(function (sum, element = undefined) {
          return sum + element;
        }, 0);
        this.resultCircuit = 1;
        this.resultFee = totalSum;
        this.inactiveResult = false;
        this.activeResult = true;
      },
      onClickTitle: function() {
        this.active = !this.active;
        this.isActive = !this.isActive;
      },
    },
    watch: {
      questionAnswer: function () {
        if (this.current_slide === 0) {
          if (this.questionAnswer === "必要") {
            this.saveAns(this.current_slide, this.questionAnswer);
            this.next(1);
          }
          if (this.questionAnswer === "不要") {
            this.saveAns(this.current_slide, this.questionAnswer);
            this.next(4);
          }
        }
        if (this.current_slide === 1) {
          if (this.questionAnswer !== "") {
            this.saveAns(this.current_slide, this.questionAnswer);
            this.next(2);
          }
        }
        if (this.current_slide === 2) {
          if (this.questionAnswer !== "") {
            this.saveAns(this.current_slide, this.questionAnswer);
            this.next(3);
          }
        }
        if (this.current_slide === 3) {
          if (this.questionAnswer !== "") {
            this.saveAns(this.current_slide, this.questionAnswer);
            console.log("finish");
            console.log(this.keepAns);
            this.totalOutput();
          }
        }
        if (this.current_slide === 4) {
          if (this.questionAnswer === "SMSを使う") {
            this.saveAns(this.current_slide, this.questionAnswer);
            this.next(3);
          }
          if (this.questionAnswer === "SMSは使わない") {
            this.saveAns(this.current_slide, this.questionAnswer);
            this.next(5);
          }
        }
        if (this.current_slide === 5) {
          if (this.questionAnswer !== "") {
            this.saveAns(this.current_slide, this.questionAnswer);
            this.next(3);
          }
        }
      },
    },
  });
};
