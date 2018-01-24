class BaseCharacter {

  constructor(name, hp, ap) {
    this.name = name;
    this.hp = hp;
    this.maxHp = hp;
    this.ap = ap;
    this.alive = true;
  }

  attack(character, damage) {
    if (this.alive == false) {
      return;
    }
    character.getHurt(damage);
  }

  heal() {
    this.hp += 30;
    if (this.hp>this.maxHp){this.hp=this.maxHp}
    var _this = this;

    _this.element.getElementsByClassName("heal-text")[0].classList.add("attacked");
    _this.element.getElementsByClassName("heal-text")[0].textContent = 30;
    setTimeout(function() {
      _this.element.getElementsByClassName("heal-text")[0].classList.remove("attacked");
      _this.element.getElementsByClassName("heal-text")[0].textContent = "";
    }, 500);
          

  }

  getHurt(damage) { 
    this.hp -= damage;
    if (this.hp <= 0) { 
      this.die();
    }

    //以下是放動畫的設定
    var _this = this;
    var i = 1;
    _this.id = setInterval(function() {
      //i==1 代表圖片第一次撥放
      if (i == 1) {
          _this.element.getElementsByClassName("effect-image")[0].style.display = "block";
          _this.element.getElementsByClassName("hurt-text")[0].classList.add("attacked");
          _this.element.getElementsByClassName("hurt-text")[0].textContent = damage;
        }
        
        _this.element.getElementsByClassName("effect-image")[0].src = 'images/effect/blade/'+ i +'.png';
        i++;
      //i>8 代表圖片撥放完畢
      if (i > 8) {
            _this.element.getElementsByClassName("effect-image")[0].style.display = "none";
            _this.element.getElementsByClassName("hurt-text")[0].classList.remove("attacked");
            _this.element.getElementsByClassName("hurt-text")[0].textContent = "";
            clearInterval(_this.id);
          }
    }, 50);
  }

  die() {
    this.alive = false;
  }

  updateHtml(hpElement, hurtElement) {
    hpElement.textContent = this.hp;
    hurtElement.style.width = (100 - this.hp / this.maxHp * 100) + "%";
  }
}

class Hero extends BaseCharacter {
  constructor(name, hp, ap) {
    super(name, hp, ap);
    console.log("召喚英雄 " + this.name + "！");
    //抓elements
    this.element = document.getElementById("hero-image-block");
    this.hpElement = document.getElementById("hero-hp");
    this.maxHpElement = document.getElementById("hero-max-hp");
    this.hurtElement = document.getElementById("hero-hp-hurt");
    //設定文字內容，show出血量
    this.hpElement.textContent = this.hp;
    this.maxHpElement.textContent = this.maxHp;
  }
  heal() {
    super.heal();
    this.updateHtml(this.hpElement, this.hurtElement);
    console.log(this.name+"英雄 補血30");
  }

  attack(character) {
    var damage = Math.random() * (this.ap / 2) + (this.ap / 2);
    super.attack(character, Math.floor(damage));
    console.log(this.name+"英雄 攻擊"+character.name+"(damage:"+Math.floor(damage)+")");
  }
  getHurt(damage) {
    super.getHurt(damage);
    this.updateHtml(this.hpElement, this.hurtElement);
  }
}

class Monster extends BaseCharacter {
  constructor(name, hp, ap) {
    super(name, hp, ap);
    console.log("出現怪物 " + this.name + "！");
    //抓elements
    this.element = document.getElementById("monster-image-block");
    this.hpElement = document.getElementById("monster-hp");
    this.maxHpElement = document.getElementById("monster-max-hp");
    this.hurtElement = document.getElementById("monster-hp-hurt");
    //設定文字內容，show出血量
    this.hpElement.textContent = this.hp;
    this.maxHpElement.textContent = this.maxHp;
  }

  attack(character) {
    var damage = Math.random() * (this.ap / 2) + (this.ap / 2);
    super.attack(character, Math.floor(damage));
    console.log(this.name+"怪物 攻擊"+character.name+"(damage:"+Math.floor(damage)+")");
  }
  getHurt(damage) {
    super.getHurt(damage);
    this.updateHtml(this.hpElement, this.hurtElement);
  }
}

var hero = new Hero("Bernard", 130, 30);
var monster = new Monster("Skeleton", 130, 10);

//使skill ID點按時使出heroAttack
function addSkillEvent() {
  var skill = document.getElementById("skill");
  skill.onclick = function() { 
    heroAttack(); 
  }
}
addSkillEvent();

var healling = document.getElementById("heal");
healling.onclick = function() { 
    heroHeal(); 
  }


//回合設定
var rounds = 10;
function endTurn() {
  rounds--;
  document.getElementById("round-num").textContent = rounds;
  if (rounds < 1) {
    // 「遊戲結束」空白區
  }
}

function heroAttack() {
  document.getElementsByClassName("skill-block")[0].style.display = "none";

  setTimeout(function() {
    hero.element.classList.add("attacking");
    setTimeout(function() {
      hero.attack(monster);
      hero.element.classList.remove("attacking");
    }, 500);
  }, 100);

  setTimeout(function() {
    if (monster.alive) {
      monster.element.classList.add("attacking");
      setTimeout(function() {
        monster.attack(hero);
        monster.element.classList.remove("attacking");
        endTurn();
        if (hero.alive == false) {
          finish();
        } else {
          document.getElementsByClassName("skill-block")[0].style.display = "block";
        }
      }, 500);
    } else {
      finish();
    }
  }, 1100);
}

function heroHeal() {
  document.getElementsByClassName("skill-block")[0].style.display = "none";
  hero.heal();
  /*
  setTimeout(function() {
    hero.element.classList.add("attacking");
    setTimeout(function() {
      hero.attack(monster);
      hero.element.classList.remove("attacking");
    }, 500);
  }, 100);
  */
  setTimeout(function() {
    if (monster.alive) {
      monster.element.classList.add("attacking");
      setTimeout(function() {
        monster.attack(hero);
        monster.element.classList.remove("attacking");
        endTurn();
        if (hero.alive == false) {
          finish();
        } else {
          document.getElementsByClassName("skill-block")[0].style.display = "block";
        }
      }, 500);
    } else {
      finish();
    }
  }, 1100);
}

function finish() {
  var dialog = document.getElementById("dialog")
  dialog.style.display = "block";
  if (monster.alive == false) {
    dialog.classList.add("win");
  } else {
    dialog.classList.add("lose");
  }
}