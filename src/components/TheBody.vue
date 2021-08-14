<template>
  <the-dialog
    :show="beginner"
    title="歡迎你"
    game="下一步"
    @close="setPlayerName"
  >
    <p class="dialogfont">請輸入你的大名：</p>
    <input class="namefield" type="text" v-model="playerName" />
  </the-dialog>
  <the-dialog :show="intro" title="關於本遊戲" game="開始" @close="confirm">
    <p class="dialogfont">
      你好阿{{
        playerName
      }}，<br />這是一個非常陽春的遊戲，不過作者還是花了很多心思，<br />如果有什麼問題或是建議都歡迎戳粉色史萊姆跟我聯絡，謝謝:)
    </p>
  </the-dialog>
  <the-dialog
    :show="winner === 'draw'"
    title="平手"
    game="在玩一次"
    @close="closeDialog"
  >
    <p class="dialogfont">你跟一隻史萊姆打個不相上下呢!</p>
  </the-dialog>
  <the-dialog
    :show="winner === 'player'"
    title="勝利"
    game="在玩一次"
    @close="closeDialog"
  >
    <p class="dialogfont">好棒!<br />你成功打敗了一隻藍色的史萊姆!</p>
  </the-dialog>
  <the-dialog
    :show="winner === 'monster'"
    title="失敗"
    game="在玩一次"
    @close="closeDialog"
  >
    <p class="dialogfont">沒事的!不要難過!<br />不過是輸給一隻史萊姆嘛!</p>
  </the-dialog>
  <section>
    <div class="main">
      <div id="enemy">
        <div class="healthbar">
          <div class="healthbar_value" :style="monsterBarStyle">
            {{ monsterHealth }}/100
          </div>
        </div>
        <p>{{ monsterName }}</p>
        <div class="imgbox">
          <img src="../assets/slime/slime_blue.png" alt="" />
        </div>
      </div>

      <div id="player">
        <div class="healthbar">
          <div class="healthbar_value" :style="playerBarStyle">
            {{ playerHealth }}/100
          </div>
        </div>
        <h3>勇者:{{ playerName }}</h3>
      </div>
    </div>

    <div class="interface">
      <div class="actionbuttons">
        <action-button @click="attackMonster"
          ><img
            src="../assets/button/attack_icon.png"
            alt=""
            class="buttonicon" /><img
            src="../assets/button/attack.png"
            alt=""
            class="buttontitle"
        /></action-button>
        <action-button :disabled="healRound" @click="healPlayer"
          ><img
            src="../assets/button/potions_icon.png"
            alt=""
            class="buttonicon"
          /><img
            src="../assets/button/potions.png"
            alt=""
            class="buttontitle"
          />
          <span class="CD" v-if="healCoolDown !== 0">{{ healCoolDown }}</span>
        </action-button>
        <action-button :disabled="specialAttackRound" @click="specialAttack">
          <img
            src="../assets/button/skills_icon.png"
            alt=""
            class="buttonicon"
          />
          <img src="../assets/button/skills.png" alt="" class="buttontitle" />
          <span class="CD" v-if="skillCoolDown !== 0">{{ skillCoolDown }}</span>
        </action-button>
        <action-button @click="surrender"
          ><img
            src="../assets/button/surrender_icon.png"
            alt=""
            class="buttonicon" /><img
            src="../assets/button/surrender.png"
            alt=""
            class="buttontitle"
        /></action-button>
      </div>
      <div id="log">
        <h3>戰鬥紀錄</h3>
        <div class="logcontent">
          <ul>
            <!-- <li>!!史萊姆圖片偏大可以在小一點，口水可能更亮一點!!(1.美化2.手機排版)</li> -->
            <li v-for="logMessage in logMessages" :key="logMessage">
              <hr />
              {{ logMessage.round }}
              <span>
                {{
                  logMessage.actionBy === "player" ? playerName : monsterName
                }}
              </span>
              <span v-if="logMessage.actionType === 'heal'">
                使用藥水，恢復
                <span class="log--heal">{{ logMessage.actionValue }}</span>
                點生命值
              </span>

              <span v-else>
                對
                {{
                  logMessage.actionTo === "player" ? playerName : monsterName
                }}
                造成
                <span class="log--damage"> {{ logMessage.actionValue }} </span>
                點傷害
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
export default {
  data() {
    return {
      poked: false,
      beginner: true,
      intro: false,
      monsterName: "藍藍的史萊姆",
      playerName: "海象司機先生",
      open: true,
      playerHealth: 100,
      monsterHealth: 100,
      currentRound: 0,
      winner: null,
      skillCoolDown: 0,
      healCoolDown: 0,
      logMessages: [],
    };
  },
  computed: {
    monsterBarStyle() {
      if (this.monsterHealth <= 0) {
        return { width: "0%" };
      }
      return { width: this.monsterHealth + "%" };
    },
    playerBarStyle() {
      if (this.playerHealth <= 0) {
        return { width: "0%" };
      }
      return { width: this.playerHealth + "%" };
    },
    specialAttackRound() {
      return this.skillCoolDown > 0;
    },
    healRound() {
      return this.healCoolDown > 0;
    },
  },
  watch: {
    playerHealth(value) {
      if (value <= 0 && this.monsterHealth <= 0) {
        this.winner = "draw";
        this.playerHealth = 0;
        this.monsterHealth = 0;
      } else if (value <= 0) {
        this.winner = "monster";
        this.playerHealth = 0;
      }
    },
    monsterHealth(value) {
      if (value <= 0 && this.playerHealth <= 0) {
        this.winner = "draw";
        this.playerHealth = 0;
        this.monsterHealth = 0;
      } else if (value <= 0) {
        this.winner = "player";
        this.monsterHealth = 0;
      }
    },
  },
  methods: {
    startGame() {
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.currentRound = 0;
      this.winner = null;
      this.skillCoolDown = 0;
      this.healCoolDown = 0;
      this.logMessages = [];
    },
    attackMonster() {
      this.currentRound++;
      if (this.skillCoolDown > 0) {
        this.skillCoolDown--;
      }
      if (this.healCoolDown > 0) {
        this.healCoolDown--;
      }
      const attackValue = getRandomValue(10, 13);
      const round = this.currentRound;
      this.monsterHealth -= attackValue;
      this.addLogMessage("player", "attack", "monster", attackValue, round);
      this.attackPLayer();
    },
    attackPLayer() {
      const attackValue = getRandomValue(0, 30);
      this.playerHealth -= attackValue;
      const round = this.currentRound;
      this.addLogMessage("monster", "attack", "player", attackValue, round);
    },
    specialAttack() {
      this.currentRound++;
      this.skillCoolDown += 3;
      if (this.healCoolDown > 0) {
        this.healCoolDown--;
      }
      const attackValue = getRandomValue(25, 25);
      this.monsterHealth -= attackValue;
      const round = this.currentRound;
      this.addLogMessage("player", "attack", "monster", attackValue, round);
      this.attackPLayer();
    },
    healPlayer() {
      this.currentRound++;
      this.healCoolDown += 2;
      if (this.skillCoolDown > 0) {
        this.skillCoolDown--;
      }
      const healValue = Math.floor(
        ((100 - this.playerHealth) / 3) * getRandomValue(1, 2)
      );
      if (this.playerHealth + healValue > 100) {
        this.playerHealth = 100;
      } else {
        this.playerHealth += healValue;
      }
      const round = this.currentRound;
      this.addLogMessage("player", "heal", "player", healValue, round);
      this.attackPLayer();
    },
    surrender() {
      this.winner = "monster";
    },
    addLogMessage(who, what, whom, value, round) {
      this.logMessages.unshift({
        actionBy: who,
        actionType: what,
        actionTo: whom,
        actionValue: value,
        round: round,
      });
    },
    closeDialog() {
      this.startGame();
    },
    setPlayerName() {
      this.beginner = false;
      this.intro = true;
    },
    confirm() {
      this.intro = false;
    },
    togglePoking() {
      this.poked = !this.poked;
    },
  },
};
</script>
<style scoped>
section {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  background-color: #a2998f;
  width: 100vw;
  /* min-width: 800px; */
  min-height: 100vh;
  overflow-x: hidden;
}
.main {
  background-color: #d0c4ac;
  width: 70vw;
  height: 70vh;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
p {
  margin: 0;
}
.namefield {
  width: 30vw;
  height: 8vh;
  margin: 0.5rem;
  text-align: center;
  font-weight: 700;
  font-family: inherit;
  font-size: 1.2rem;
  color: #666;
  border: 2px solid #666;
  border-radius: 1em;
}
.namefield:focus {
  color: black;
}
.dialogfont {
  font-size: 1.2rem;
}
#enemy,
#player {
  text-align: center;
}
#enemy {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.healthbar {
  height: 40px;
  border: 1px solid #d0c4ac;
  margin: 1rem 0 0 0;
  background: #8d929d;
}
#enemy .healthbar {
  width: 55vw;
}
#enemy .healthbar_value {
  background-color: #4f4a4b;
  width: 100%;
  height: 100%;
  color: #ddd;
}
#enemy p {
  color: #33292b;
}
#player {
  margin-bottom: calc(0.5rem + 0.4vw);
}
#player .healthbar {
  margin: 0.5rem 0 0 1.2rem;
  width: 15vw;
}
#player .healthbar_value {
  background-color: #4f4a4b;
  width: 100%;
  height: 100%;
  color: #ddd;
}
#player h3 {
  text-align: start;
  margin: 0 0 0 1.2rem;
  color: #33292b;
}
.imgbox {
  width: 20vw;
  height: 20vw;
  border-radius: 50%;
}
.imgbox img {
  width: 20vw;
  margin-top: 1rem;
}

.interface {
  width: 70vw;
  height: 30vh;
  display: flex;
  justify-content: stretch;
  align-content: space-around;
  background-color: #d0c4ac;
}
.actionbuttons {
  width: 40vw;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
  margin-left: 1.2rem;
}
.actionbuttons button {
  width: 18vw;
  height: 12vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.actionbuttons .buttonicon {
  width: 6vw;
}
.actionbuttons .buttontitle {
  width: 10vw;
}
.CD {
  color: #ccc;
}
#log {
  margin: 0 1.2rem 0.5rem 0.3rem;
  border: solid 3px white;
  border-radius: 1em;
  width: 30vw;
  text-align: center;
  box-shadow: 5px 5px 9px 2px rgba(79, 74, 75, 0.3);
}
#log h3 {
  color: #33292b;
  margin: 5px 0 0.5rem 0;
}
.logcontent {
  height: 23vh;
  overflow-y: auto;
}
::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-thumb {
  background: #4f4a4b;
}
::-webkit-scrollbar-thumb:hover {
  background: #33292b;
}
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  margin: 0.5rem;
}
@media (max-width: 767px) {
  .namefield {
    width: 80vw;
    height: 8vh;
    font-size: 1.3rem;
  }
  .dialogfont {
    font-size: 24px;
  }
  .main {
    width: 90vw;
    height: 70vh;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
  }
  #enemy {
    flex-direction: column-reverse;
  }
  .healthbar {
    height: 2rem;
    margin: 0;
    font-size: 1.2rem;
  }
  .healthbar_value {
    line-height: 2rem;
  }
  #enemy .healthbar {
    width: 70vw;
  }

  #enemy p {
    font-size: 1.2rem;
  }
  .imgbox {
    width: 60vw;
    height: 60vw;
    margin-bottom: 1rem;
  }
  .imgbox img {
    width: 60vw;
  }

  #player {
    display: flex;
    justify-content: center;
    flex-direction: column-reverse;
    align-items: center;
    margin-bottom: calc(0.5rem + 0.4vw);
  }
  #player .healthbar {
    width: 70vw;
    margin: 0;
  }

  #player h3 {
    margin: 0;
  }

  .interface {
    width: 90vw;
    height: 100%;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .actionbuttons {
    width: 80vw;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-left: 0;
    margin-bottom: 0.5rem;
  }
  .actionbuttons button {
    width: 18vw;
    height: 8vh;
    justify-content: center;
    align-items: center;
  }
  .actionbuttons .buttonicon {
    width: 6vw;
    display: none;
  }
  .actionbuttons .buttontitle {
    width: 17vw;
  }
  .CD {
    position: relative;
    top: -30%;
    left: -20%;
  }
  #log {
    margin: 1rem 0;
    width: 80vw;
  }
  #log h3 {
    margin: 0.5rem 0;
  }
  .logcontent {
    height: 23vh;
  }
  li {
    font-size: 0.8em;
  }
}
</style>