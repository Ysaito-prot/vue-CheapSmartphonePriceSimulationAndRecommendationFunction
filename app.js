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
      activeFixedPri: false,
      tell: "",
      sim: "",
      plan: "",
      planPri: "",
      planPri2: "",
      fixed: "",
      fixedPri: "",
      priBtn: false,
      priBtnSub: true,
      breakdownBtn: false,
      breakdownBtnSub: true,
      // 前に回答した内容を記録
      pastContent: [{ slideNum: 0, ans: "" },{ slideNum: 1, ans: "" },{ slideNum: 2, ans: "" },{ slideNum: 3, ans: "" },{ slideNum: 4, ans: "" },{ slideNum: 5, ans: "" },{ slideNum: 6, ans: "" }]
    },
    created: async function () {
      const res = await fetch("./asset/qA.json");
      const users = await res.json();
      this.qA = users;
      const res1 = await fetch("./asset/price.json");
      const pricesSub = await res1.json();
      this.prices = pricesSub;
    },
    methods: {
      next: async function (x) {
        this.trans_name = "next";
        this.current_slide = x;
        this.priBtn = true;
        this.priBtnSub = false;
        this.colorChange();
      },
      prevQ: async function () {
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
        else if (this.current_slide === 1 || this.current_slide === 4) {
          this.current_slide = this.keepAns[this.keepAns.length - 1].sliderNum;
          this.keepAns.pop();
          this.priBtn = false;
          this.priBtnSub = true;
        }
        else {
          this.current_slide = this.keepAns[this.keepAns.length - 1].sliderNum;
          this.keepAns.pop();
        }
        this.colorChange();
      },
      wait: function (time) {
        return new Promise((resolve, reject) => {
          setTimeout(resolve, time);
        });
      },
      onActive(item) {
        this.pastContent[this.current_slide].ans = item;
        if (this.current_slide === 3) {
          this.ScrollWindow("cp-msg");
        }
      },
      ScrollWindow: function (elem) {
        var element = document.getElementsByClassName(elem)[0];
        var rect = element.getBoundingClientRect();
        var elemtop = rect.top + window.pageYOffset;
        document.documentElement.scrollTo({
          top: elemtop - 20,
          behavior: "smooth",
        });
      },
      colorChange: async function () {
        // 過去に回答したものと一致するものがあれば色を付ける
        await this.wait(330);
        let colorChanges = document.querySelectorAll('.text-area.main-text');
        let qitem = document.querySelectorAll('.q-item');
        if (this.pastContent[this.current_slide].ans !== "") {
          for (i = 0; i < this.pastContent.length; i++){
            for (j = 0; j < colorChanges.length; j++){
              if (this.current_slide === this.pastContent[i].slideNum) {
                if (this.pastContent[i].ans === colorChanges[j].innerHTML) {
                  qitem[j].classList.add("is-active");
                  qitem[j].classList.remove("colorChangeGlay");
                } else {
                  qitem[j].classList.remove("is-active");
                  qitem[j].classList.add("colorChangeGlay");
                }
              }
            }
          }
        }
      },
      saveAns: function (x, y, z) {
        this.keepAns.push({ sliderNum: x, ans: y, breakdown: z });
        this.questionAnswer = "";
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
        this.resultCircuit = 1;
        this.inactiveResult = false;
        this.activeResult = true;
        this.breakdownBtn = true;
        this.breakdownBtnSub = false;
      },
      onClickTitle: function () {
        this.active = !this.active;
        this.isActive = !this.isActive;
      },
      reflectionFixedPri: function (x) {
        for (i = 0; i < x.length; i++){
          if (this.keepAns[2].ans === x[i][0]) {
            this.fixedPri = x[i][1];
          }
        }
      },
      reflectionPlanPri: function (x, y) {
        for (i = 0; i < x.length; i++){
          if (this.keepAns[y].ans === x[i][0]) {
            this.planPri = x[i][1].toLocaleString();
            this.planPri2 = x[i][1];
          }
        }
      },
      dataSave: function (x) {
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
            if (this.keepAns[0].ans === "必要") {
              if (this.keepAns.length === 1) {
                this.tell = this.keepAns[0].breakdown;
              }
              if (this.keepAns.length === 2) {
                this.sim = this.keepAns[1].breakdown;
              }
              if (this.keepAns.length === 3) {
                this.activeFixedPri = true;
                this.fixed = this.keepAns[2].breakdown;
                this.reflectionFixedPri(this.prices.fixedPrice);
              }
              if (this.keepAns.length === 4) {
                this.plan = this.keepAns[3].breakdown;
                this.reflectionPlanPri(this.prices.SIMeSIM, 3);
              }
            }
            if (this.keepAns[0].ans === "不要") {
              this.planPri = 0;
              this.planPri2 = 0;
              if (this.keepAns.length === 1) {
                this.tell = this.keepAns[0].breakdown;
              }
              if (this.keepAns.length === 2) {
                this.fixedPri = 0;
                this.activeFixedPri = false;
                this.sim = this.keepAns[1].breakdown;
              }
              if (this.keepAns.length === 3 && this.keepAns[1].ans === "SMSを使う") {
                this.plan = this.keepAns[2].breakdown;
                this.reflectionPlanPri(this.prices.SMS, 2);
              }
              if (this.keepAns.length === 3 && this.keepAns[2].ans === "データeSIMを使う") {
                this.sim = this.keepAns[2].breakdown;
              }
              if (this.keepAns.length === 3 && this.keepAns[2].ans === "データeSIMは使わない") {
                this.sim = this.keepAns[2].breakdown;
              }
              if (this.keepAns.length === 4) {
                this.plan = this.keepAns[3].breakdown;
                if (this.keepAns[2].ans === "データeSIMを使う") {
                  this.reflectionPlanPri(this.prices.dataeSIM, 3);
                }
                if (this.keepAns[2].ans === "データeSIMは使わない") {
                  this.reflectionPlanPri(this.prices.notDataeSIM, 3);
                }
              }
            }
            // 合計料金をリアルタイムで計算
            this.resultFee = (this.planPri2 + this.fixedPri).toLocaleString();
          }
        }
      }
    },
    watch: {
      questionAnswer: function () {
        if (this.current_slide === 0) {
          if (this.questionAnswer === "必要") {
            this.dataSave(1);
          }
          if (this.questionAnswer === "不要") {
            this.dataSave(4);
          }
        }
        if (this.current_slide === 1 && this.questionAnswer !== "") {
            this.dataSave(2);
        }
        if (this.current_slide === 2 && this.questionAnswer !== "") {
            this.dataSave(3);
        }
        if (this.current_slide === 3 && this.questionAnswer !== "" && this.keepAns.length === 3 && this.keepAns[1].ans !== "SMSを使う") {
            this.dataSave(3);
            this.totalOutput();
        }
        // 最後の質問で再度選択された場合
        if (this.current_slide === 3 && this.questionAnswer !== "" && this.keepAns.length === 4) {
            this.keepAns.pop();
            this.dataSave(3);
            this.totalOutput();
        }
        // 最後の質問で再度選択された場合(最初の質問で「不要」、2つ目の質問で「SIMを使う」が選択されている場合)
        if (this.current_slide === 3 && this.questionAnswer !== "" && this.keepAns.length === 3 && this.keepAns[1].ans === "SMSを使う") {
          this.keepAns.pop();
          this.dataSave(3);
          this.totalOutput();
      }
        // 最初の質問で「不要」、2つ目の質問で「SIMを使う」が選択された場合
        if (this.current_slide === 3 && this.questionAnswer !== "" && this.keepAns.length === 2) {
          this.dataSave(3);
          this.totalOutput();
      }
        if (this.current_slide === 4) {
          if (this.questionAnswer === "SMSを使う") {
            this.dataSave(3);
          }
          if (this.questionAnswer === "SMSは使わない") {
            this.dataSave(5);
          }
        }
        if (this.current_slide === 5 && this.questionAnswer !== "") {
            this.dataSave(3);
        }
      },
    },
  });
};
