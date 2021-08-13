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
    <p class="dialogfont">好棒!<br>你成功打敗了一隻藍色的史萊姆!</p>
  </the-dialog>
  <the-dialog
    :show="winner === 'monster'"
    title="失敗"
    game="在玩一次"
    @close="closeDialog"
  >
    <p class="dialogfont">沒事的!不要難過!<br>不過是輸給一隻史萊姆嘛!</p>
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
          <p class="CD" v-if="healCoolDown !== 0">{{ healCoolDown }}</p>
        </action-button>
        <action-button :disabled="specialAttackRound" @click="specialAttack">
          <img
            src="../assets/button/skills_icon.png"
            alt=""
            class="buttonicon"
          />
          <img src="../assets/button/skills.png" alt="" class="buttontitle" />
          <p class="CD" v-if="skillCoolDown !== 0">{{ skillCoolDown }}</p>
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
            <!-- <li>細節最後補(1.美化2.按鈕hover跑細節)</li> -->
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
  background-color: #999;
  width: 100vw;
  /* min-width: 800px; */
  min-height: 100vh;
  overflow-x: hidden;
}
.main {
  background-color: #ccc;
  width: 70vw;
  height: 70vh;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
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
  border: 1px solid #575757;
  margin: 1rem 0 0 0;
  background: #fde5e5;
}
#enemy .healthbar {
  width: 80%;
}
#enemy .healthbar_value {
  background-color: #00a876;
  width: 100%;
  height: 100%;
}
#player .healthbar {
  margin: 0.5rem 0 0 1.2rem;
  width: 20%;
}
#player .healthbar_value {
  background-color: #00a876;
  width: 100%;
  height: 100%;
}
#player h3 {
  text-align: start;
  margin: 0 0 0 1.2rem;
}
.imgbox img {
  width: calc(200px + 10vw);
  margin-top: 2vh;
}

.interface {
  width: 70vw;
  height: 30vh;
  display: flex;
  justify-content: stretch;
  align-content: space-around;
  background-color: #ccc;
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
}
#log h3 {
  margin: 0 0 0.5rem 0;
}
.logcontent {
  height: 23vh;
  overflow-y: auto;
}
::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-thumb {
  background: red;
}
::-webkit-scrollbar-thumb:hover {
  background: #b30000;
}
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  margin: 0.5rem;
}
</style>