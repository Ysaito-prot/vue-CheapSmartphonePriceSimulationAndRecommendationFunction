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
        if (this.current_slide === 3 && this.keepAns.length === 4) {
          this.keepAns.pop();
          this.current_slide = this.keepAns[this.keepAns.length - 1].sliderNum;
          this.keepAns.pop();
        }
        else if (this.current_slide === 3 && this.keepAns.length === 3 && this.keepAns[1].ans === "SMSを使う") {
          this.keepAns.pop();
          this.current_slide = this.keepAns[this.keepAns.length - 1].sliderNum;
          this.keepAns.pop();
        }
        else {
          this.current_slide = this.keepAns[this.keepAns.length - 1].sliderNum;
          this.keepAns.pop();
        }
        console.log(this.keepAns);
      },
      saveAns: function (x, y, z) {
        this.keepAns.push({ sliderNum: x, ans: y, breakdown: z });
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
              this.resultCap = this.prices.SMS[i][2];
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
      onClickTitle: function () {
        this.active = !this.active;
        this.isActive = !this.isActive;
      },
      saito: function (x) {
        for (i = 0; i < this.qA[this.current_slide].ans.length; i++) {
          if (this.questionAnswer === this.qA[this.current_slide].ans[i].msg1.text) {
            this.saveAns(
              this.current_slide,
              this.questionAnswer,
              this.qA[this.current_slide].ans[i].detailed
            );
            if (x !== "") {
              this.next(x);
            }
          }
        }
      }
    },
    watch: {
      questionAnswer: function () {
        if (this.current_slide === 0) {
          if (this.questionAnswer === "必要") {
            this.saito(1);
          }
          if (this.questionAnswer === "不要") {
            this.saito(4);
          }
        }
        if (this.current_slide === 1 && this.questionAnswer !== "") {
            this.saito(2);
        }
        if (this.current_slide === 2 && this.questionAnswer !== "") {
            this.saito(3);
        }
        if (this.current_slide === 3 && this.questionAnswer !== "" && this.keepAns.length === 3 && this.keepAns[1].ans !== "SMSを使う") {
            this.saito(3);
            console.log("finish");
            console.log(this.keepAns);
            this.totalOutput();
        }
        // 最後の質問で再度選択された場合
        if (this.current_slide === 3 && this.questionAnswer !== "" && this.keepAns.length === 4) {
            this.keepAns.pop();
            this.saito(3);
            console.log("finish");
            console.log(this.keepAns);
            this.totalOutput();
        }
        // 最後の質問で再度選択された場合(最初の質問で「不要」、2つ目の質問で「SIMを使う」が選択されている場合)
        if (this.current_slide === 3 && this.questionAnswer !== "" && this.keepAns.length === 3 && this.keepAns[1].ans === "SMSを使う") {
          this.keepAns.pop();
          this.saito(3);
          console.log("finish");
          console.log(this.keepAns);
          this.totalOutput();
      }
        // 最初の質問で「不要」、2つ目の質問で「SIMを使う」が選択された場合
        if (this.current_slide === 3 && this.questionAnswer !== "" && this.keepAns.length === 2) {
          this.saito(3);
          console.log("finish");
          console.log(this.keepAns);
          this.totalOutput();
      }
        if (this.current_slide === 4) {
          if (this.questionAnswer === "SMSを使う") {
            this.saito(3);
          }
          if (this.questionAnswer === "SMSは使わない") {
            this.saito(5);
          }
        }
        if (this.current_slide === 5 && this.questionAnswer !== "") {
            this.saito(3);
        }
      },
    },
  });
};
