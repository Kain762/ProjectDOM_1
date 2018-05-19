var randomLoc=Math.floor(Math.random()*5);  //Рандомная координата\
var seaRow=[];                              //координаты корабля\
seaRow[0]=randomLoc;
seaRow[1]=seaRow[0]+1;
seaRow[2]=seaRow[1]+1;
var guess, hit=0, guessNum=0;               //цель\попадания\номер выстрела\
var isShink=false;                          //флаг потопления\
/////Логика/////
while (!isShink){
    guess=prompt('Прицелься, стреляй и молись (веди координату от 0-6)');
    //Проверка на корректность ввода пользователя
    if (!(0<=guess && guess<=6))alert('Куда ты целишься?!?! Дай правильные координаты!');
    else {
        guessNum++;
        //конец проверки
        //Проверка на попадание
        if (guess == seaRow[0] || guess == seaRow[1] || guess == seaRow[2]){
            alert('Попал!');
            hit++;
            //проверка на потопление
            if(hit===3){
                isShink=true;
                alert('Ты укокошил мой корабль!!!');
            }
        }
        else alert('Промазал. сухопутная... ');
    }

}
//итоги и статистика
var stats='Ты выстрелил '+guessNum+' раз и твоя точность составила '+(hit*100/guessNum)+' процентов';
alert(stats);