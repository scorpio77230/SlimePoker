<template>
  <the-dialog
    :show="poked"
    title="遊戲解說"
    game="關閉"
    @close="togglePoking"
  >
  <div class="info">
    <p>你眼前是一隻史萊姆，藍藍的，你可以做的事情有四樣：<br>攻擊、技能、藥水、投降</p>
    <p>每個動作結束史萊姆都會馬上反擊，動作解說如下：</p>
    <p>攻擊：用你左手邊最靠進的物體對怪物造成10~13點傷害</p>
    <p>技能：投擲身邊最危險物品對怪物造成25點傷害，冷卻3回合</p>
    <p>藥水：喝一口肥宅快樂水，回復失去生命的約33%生命值，<br>有機會回復雙倍數值，冷卻2回合</p>
    <p>投降：大喊一聲「我就爛!」 放棄遊戲</p>
    <p>史萊姆攻擊：有時候很痛有時候會失誤</p>
    <h6>作者：Edwin Huang<br>20210814 v.1</h6>
    <h6></h6>
  </div>
  </the-dialog>
  <header>
    <img @click="togglePoking" src="../assets/slime/slime_pink.png" alt="pinkslime">
  </header>
</template>

<script>
export default {
  data() {
    return {
      poked: false,
    }
  },
  methods: {
    togglePoking() {
      this.poked = !this.poked;
    }
  }
};
</script>

<style scoped>
.info {
  height: 30vh;
  overflow-y: auto;
}
::-webkit-scrollbar {
  width: 3px;
}
::-webkit-scrollbar-thumb {
  background: #666;
}
::-webkit-scrollbar-thumb:hover {
  background: #777;
}
header {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 15vw;
  height: 100px;
  text-align: center;
  line-height: 100px;
  font-size: calc(18px + 0.7vw);
}
img {
  width: 80px;
  cursor: pointer;
  transform: scaleX(-1);
}
@media (max-width: 767px) {
  header {
    position: fixed;
  }
  img{
    margin: 5px;
    width: 60px;
  }
}
</style>