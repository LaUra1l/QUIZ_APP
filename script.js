class IconInteraction{

    constructor(){   
        
    }

    getElement(element){
        const item=document.querySelector(element);
      
        return item
    }
    #getElements(elements){
        const items=[...document.querySelectorAll(elements)];
       
        return items;
    }
    #addClass(element,className){
        
        return element.classList.add(className);
    }
    enRoll(element,elementToShow,elementListener,
        classNameONE,classNameTWO
    ){
        let roll=true;
        const icon=this.getElement(element);
        const result=this.getElement(elementToShow);

        icon.addEventListener(elementListener,()=>{
           if(roll){
            roll=!roll;
            result.style.display="block";
            icon.className=classNameTWO
           }
           else{
            roll=!roll;
            result.style.display="none";
            icon.className=classNameONE;
           }
        })
    }
    addAnimation(
        // PODSTAWOWE
        element, animation, eventListener,
       
        //ROZSZEZONE O ZMIANE IKONY
        returnToPrev,oldIcon,newIcon,
        // ROZSZEONE O DODANIE INNYCH ANIMACJI NA INNE ELEMENTY
        goWithNextAnimations,elementOne,elementTwo,elementThree,aniamtionOne,animationTwo, animationThree
        
    ) {
        const getElement = this.getElement(element);
        if(eventListener){
            getElement.addEventListener(eventListener, () => {
            getElement.style.animation = animation;
            
           

            //ROZSZEZONE O ZMIANE IKONY

           if(oldIcon && newIcon!=undefined){
            getElement.className=newIcon;
           }
          
            
            if(returnToPrev){
                getElement.addEventListener("animationend",()=>{
                    getElement.style.animation="none";        
    
                    if(oldIcon && newIcon!=undefined){
                        getElement.className=oldIcon;
                       }
                })
            }
            //---


             // ROZSZEONE O DODANIE INNYCH ANIMACJI NA INNE ELEMENTY
            if(goWithNextAnimations){
                const itemOne=this.getElement(elementOne);
                const itemTwo=this.getElement(elementTwo);
                const itemThree=this.getElement(elementThree);

                getElement.addEventListener("animationend",()=>{
                    itemOne.style.animation=aniamtionOne;
                    itemTwo.style.animation=animationTwo;
                    itemThree.style.opacity="0";

                   itemOne.addEventListener("animationend",()=>{
                    
                    itemThree.style.animation=animationThree;
                   })
                   
                })


            }
            //---
            
            
             
        });
        }else{
            getElement.style.animation = animation;
        }
    }

}

const nav=new IconInteraction();
nav.enRoll(".settings",".navList","click","fa-solid fa-bars-staggered settings","fa-regular fa-circle-xmark settings");
class Quiz {
    constructor(title, author) {
        this.title = title;
        this.author = author;
        this.questions = [];
    }

    crear() {
        return {
            title: this.title,
            author: this.author,
            questions: this.questions
        };
    }

    removeQuestion(index) {
        this.questions.splice(index, 1);
    }
}

class QuizSystem {
    constructor() {
        this.currentQuiz = null;
        this.actualSection = null;
        this.nextSection = null;
        this.prevSection = null;
    }

    #getElement(element) {
        return document.querySelector(element);
    }
    #getQuizKeys() {
        return JSON.parse(localStorage.getItem('quizKeys')) || [];
    }

    #setQuizKeys(keys) {
        localStorage.setItem('quizKeys', JSON.stringify(keys));
    }

    #saveQuiz(quiz) {
        const quizKeys = this.#getQuizKeys();
        if (!quizKeys.includes(quiz.title)) {
            quizKeys.push(quiz.title);
        }
        this.#setQuizKeys(quizKeys);
        localStorage.setItem(quiz.title, JSON.stringify(quiz));
    }

    #getQuiz(title) {
        return JSON.parse(localStorage.getItem(title));
    }

    #removeQuiz(title) {
        const quizKeys = this.#getQuizKeys();
        const index = quizKeys.indexOf(title);
        if (index > -1) {
            quizKeys.splice(index, 1);
            this.#setQuizKeys(quizKeys);
            localStorage.removeItem(title);
        }
    }

    #setObjectToStorage(key, value) {
        return localStorage.setItem(key, JSON.stringify(value));
    }

    #getObjectFromStorage(key) {
        return JSON.parse(localStorage.getItem(key));
    }

    #removeObjectFromStorage() {
        return localStorage.removeItem(this.currentQuiz.title);
    }

    #goToNextSection(actual, next) {
        actual.style.display = "none";
        next.style.display = "block";
    }

    #backToPrevSection(actual, prev) {
        actual.style.display = "none";
        prev.style.display = "block";
    }

    #resetForm() {
        const questionValue = this.#getElement("#question-value");
        questionValue.value = "";

        const options = document.querySelectorAll(".option");
        options.forEach(op => {
            op.children[0].checked = false;
            op.children[1].value = "";
        });
    }


    createQuiz(btn_class_go, inp1_id, inp2_id, thisSection_class, nextSection_class) {
        const btn_go = this.#getElement(btn_class_go);
        const thisSection = this.#getElement(thisSection_class);
        const nextSection = this.#getElement(nextSection_class);

        this.actualSection = thisSection;
        this.nextSection = nextSection;

        btn_go.addEventListener("click", (e) => {
            const inp1 = this.#getElement(inp1_id).value;
            const inp2 = this.#getElement(inp2_id).value;

            if (inp1 && inp2) {
                e.preventDefault();

                const quiz = new Quiz(inp1, inp2).crear();
                this.currentQuiz = quiz;

                this.#saveQuiz(this.currentQuiz);
                this.#goToNextSection(this.actualSection, nextSection);
            } else {
                alert("Primero escribe el autor y el titulo");
            }
        });
    }

    createPreguntas(btnClassBack, actualSection, prevSection, titleSpace, authorSpace) {
        const titleElem = this.#getElement(titleSpace);
        const authorElem = this.#getElement(authorSpace);

        const prev = this.#getElement(prevSection);
        const actual = this.#getElement(actualSection);

        if (titleElem && authorElem) {
            titleElem.textContent = this.currentQuiz.title;
            authorElem.textContent = this.currentQuiz.author;
        }
    }

    #cleanQuestionList(ul){
        while(ul.firstChild){
            ul.removeChild(ul.firstChild);
        }
    }

    goTo_b(btn_class,questionList_class){
        const getBtn=this.#getElement(btn_class);
        const actual=this.#getElement(".quiz-d");
        const prev=this.#getElement(".quiz-c");
        const questionList=this.#getElement(questionList_class);

        getBtn.addEventListener("click",(e)=>{
            e.preventDefault();
            this.#backToPrevSection(actual,prev);
            this.#cleanQuestionList(questionList);
        })
    }

    addOption(btn_class, contener_class) {
        if (this.#getElement(btn_class)) {
            const btn = this.#getElement(btn_class);
            const contener = this.#getElement(contener_class);

            btn.addEventListener("click", (e) => {
                e.preventDefault();
                const checkbox = document.createElement('input');
                checkbox.type = "checkbox";
                checkbox.className = "checkboxDesign inp";
                const input = document.createElement('input');
                input.type = "text";
                input.className = "inputDesign valueTxt";
                const br = document.createElement('br');
                const optionDiv = document.createElement('div');
                optionDiv.className = "option";
                const btnDelate=document.createElement('button');
                btnDelate.className="delateBtn_b btnDesign3";
                btnDelate.textContent="X";
                btnDelate.onclick=this.removeFromDOM;

                optionDiv.appendChild(checkbox);
                optionDiv.appendChild(input);
                optionDiv.appendChild(btnDelate);
                optionDiv.appendChild(br);
                contener.appendChild(optionDiv);
            });
        }
    }

    section_b(option_class, btn_go, btn_back, actualSection, nextSection, questionValue_class, prevSection, numberOfQuestions_class) {
        const btn = this.#getElement(btn_go);
        const actual = this.#getElement(actualSection);
        const next = this.#getElement(nextSection);
        const prev = this.#getElement(prevSection);
        const btn_goBack = this.#getElement(btn_back);

        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const option = document.querySelectorAll(option_class);
            const questionValue = this.#getElement(questionValue_class).value;
            const numberOfQuestions = this.#getElement(numberOfQuestions_class);

            const question = {
                trues: [],
                falses: [],
                all: [],
                type: "",
                questionTxt: questionValue
            };

            option.forEach(op => {
                question.all.push(op.children[1].value);

                if (op.children[0].checked) {
                    question.trues.push(op.children[1].value);
                } else {
                    question.falses.push(op.children[1].value);
                }
            });

            if (this.currentQuiz) {
                this.currentQuiz.questions.push(question);
                this.#setObjectToStorage(this.currentQuiz.title, this.currentQuiz);

                this.#goToNextSection(actual, next);
                numberOfQuestions.textContent = this.currentQuiz.questions.length;

                btn_goBack.addEventListener("click", (e) => {
                    e.preventDefault();
                    prev.style.display = "block";
                    actual.style.display = "none";
                }, { once: true });
            }
        });
    }

    chooce_btns(btn_crearOtro, btn_terminar, section_b_class, section_d_class, section_c_class,

        //DO FUNKCJI SECTION_D:
        author_place, title_place, questions_place, number_place
    ) {
        const btn_new = this.#getElement(btn_crearOtro);
        const btn_fin = this.#getElement(btn_terminar);

        const section_b = this.#getElement(section_b_class);
        const section_d = this.#getElement(section_d_class);
        const section_c = this.#getElement(section_c_class);

        btn_new.addEventListener("click", (e) => {
            e.preventDefault();
            section_c.style.display = "none";
            section_b.style.display = "block";
            this.#resetForm();
        });

        btn_fin.addEventListener("click", (e) => {
            e.preventDefault();
            section_c.style.display = "none";
            section_d.style.display = "block";

            this.section_d(author_place, title_place, questions_place, number_place);
        });
    }

    section_d(author_place, title_place, questions_place, number_place) {
        const authorElem = this.#getElement(author_place);
        const titleElem = this.#getElement(title_place);
        const questionElem = this.#getElement(questions_place);
        const numberElem = this.#getElement(number_place);

        const quiz = this.#getObjectFromStorage(this.currentQuiz.title);
        console.log(quiz);

        authorElem.textContent = `El autor: ${quiz.author}`;
        titleElem.textContent = `El titulo: ${quiz.title}`;
        numberElem.textContent = `La cantidad de las preguntas: ${quiz.questions.length}`;

        for (let i = 0; i < quiz.questions.length; i++) {
            const li = document.createElement("li");
            const btnDelate = document.createElement('button');
            btnDelate.className = "delateBtn_d btnDesign3";
            btnDelate.textContent = "X";
            

            btnDelate.addEventListener("click", function(e) {
                e.preventDefault();

                if (confirm("Si apretes 'OK' vas a eliminar esta pregunta")) {
                    this.parentNode.remove();
   
                    quiz.questions.splice(i, 1);

                    localStorage.setItem(quiz.title, JSON.stringify(quiz));

                    numberElem.textContent = `La cantidad de las preguntas: ${quiz.questions.length}`;

                    console.log( quiz.questions);
                }
            });

            li.textContent = quiz.questions[i].questionTxt;
            li.appendChild(btnDelate);
            questionElem.appendChild(li);
        }
    }
    #generateUniqueKey(base) {
        return `${base}_${Date.now()}`;
    }

    #addQuizKeyToList(key) {
        let keys = JSON.parse(localStorage.getItem('quizKeys')) || [];
        keys.push(key);
        localStorage.setItem('quizKeys', JSON.stringify(keys));
    }

    section_e(btn_class, actual_class, next_class) {
        const btn_convalidar = this.#getElement(btn_class);
        const next = this.#getElement(next_class);
        const actual = this.#getElement(actual_class);

        btn_convalidar.addEventListener("click", (e) => {
            e.preventDefault();
            this.#goToNextSection(actual, next);

            // Save current quiz to localStorage
            if (this.currentQuiz) {
                this.#saveQuiz(this.currentQuiz);
            }
        });
    }

    removeFromDOM(){

        this.parentNode.remove();
    }
    buttonsDel(btn_class){
        const buttons=document.querySelectorAll(btn_class);
        buttons.forEach(btn=>{
            btn.addEventListener("click",function(e){
                e.preventDefault()
                btn.parentNode.remove();
            })
        })
    }
}


class QuizShow {
    constructor() {
        this.results=new Results()
        this.appendDOM();
    }

    #createElement(item) {
        return document.createElement(item);
    }

    #getElement(item) {

        return document.querySelector(item);
    }

    #clearChildren(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }

    #crearDOM_div(className1, className2, className3, className4, elem1, elem2, contenerElem, quiz) {

        const item1 = this.#createElement(elem1);
        item1.className = className1;

        item1.addEventListener("click", () => {
            this.results.reset();
            const sub_contener = this.#getElement(".answers_contener");
            this.#clearChildren(sub_contener);
            this.#isResultUp();
            this.showQuiz(".my_quiz_a", ".my_quiz_b", quiz);
        });

        const item2 = this.#createElement(elem2);
        item2.className = className2;
        item2.textContent = quiz.title;

        const item3 = this.#createElement(elem2);
        item3.className = className3;
        item3.textContent = quiz.author;

        const item4 = this.#createElement(elem2);
        item4.className = className4;
        item4.textContent = `Preguntas: ${quiz.questions.length}`;

        const contener = this.#getElement(contenerElem);
        item1.appendChild(item2);
        item1.appendChild(item4);
        item1.appendChild(item3);
        contener.appendChild(item1);
    }
    #isResultUp(){
        if(this.#getElement('.section_result')){
            this.#getElement('.section_result').style.display="none";
        }
    }

    showQuiz(my_quiz_a,my_quiz_b,quiz){

            const section_a=this.#getElement(my_quiz_a);
            const section_b=this.#getElement(my_quiz_b);
        
            console.log("click")
            section_a.style.display='block';
            section_b.style.display="none";
            const title_space=section_a.querySelector('.title_misQuizis');
            title_space.textContent=quiz.title;
            const author_space=section_a.querySelector('.author_misQuizis');
            author_space.textContent=quiz.author;
            const questions_space=section_a.querySelector('.questions_misQuizis');
            questions_space.textContent=`PREGUNTAS: ${quiz.questions.length}`;

            new Navigation(my_quiz_a);

            this.start_quiz(".btn_startQuiz",section_a,".my_quiz_b",quiz)
            

    }

    start_quiz(btn,section_a,my_quiz_b,quiz){
        
        const button=section_a.querySelector(btn);
        const section_b=this.#getElement(my_quiz_b);

        button.addEventListener("click",()=>{
            section_b.style.display="block";
            new Navigation(my_quiz_b);
            
            this.crearAnswer(quiz);
            
        },{once:true});

    }

    checkQuiz(question,question_div){

        const true_answer=question.trues;

        let your_answer_html = [...question_div.querySelectorAll(`.checkboxDesign:checked`)];
        let your_answer=[];
        let draw_all=[];
        let draw_green=[];
        let draw_red=[];

         
        for(let i=0;i<your_answer_html.length;i++){
            let phase1=your_answer_html[i].parentNode;
            draw_all.push(phase1);

            let phase2=phase1.querySelector('.inputDesign2').textContent;
            your_answer.push(phase2);
        }
        

        if(this.#arrayEqual(your_answer,true_answer)){
            this.results.win();
            draw_green=draw_green.concat(draw_all);
            this.results.drawResults(draw_green,"green");
            
        }
        else if(your_answer.length===0){
            console.log("nie licze");

        }
        else{
            this.results.loose();
            draw_red=draw_red.concat(draw_all);
            this.results.drawResults(draw_red,"red");
        }

       

        this.results.showResults();
        
        console.log("RED: ",draw_red);
        console.log("GREEN: ",draw_green);

        
    }


    #arrayEqual(arr1,arr2){
        if(arr1.length!=arr2.length){
            return false;
        }

        for(let i=0;i<arr1.length;i++){
            if(arr1[i]!==arr2[i]){
                return false;
            }
        }

        return true;
    }

    crearAnswer(quiz){
   
        console.log("Q-U-I-Z: ",quiz);

        const allQuestions=quiz.questions;

        console.log("-----",allQuestions,"-----")
        const contener=this.#getElement(".answers_contener");

        //przycisk pobrany do zatwierdzenia quizu:
        const btn_convalidar=this.#getElement(".convalidar_answer");
        
        this.#clearChildren(contener);

        allQuestions.forEach(question=>{
            console.log("TU PATRZ-->",question)
            const questiontionContener=this.#createElement('div');
            questiontionContener.className="questionDiv";

            const allAnswers=question.all;
            const trueAnswers=question.trues;

            const questionTxt=this.#createElement('h2');
            questionTxt.className="txt question_title";
            questionTxt.textContent=question.questionTxt;
    
            questiontionContener.appendChild(questionTxt);


            allAnswers.forEach(answer=>{
                
                const answerDiv=this.#createElement('div');
                answerDiv.className="answer";

                if(trueAnswers.includes(answer)){
                    answerDiv.dataset.true="true";
                }
    
                const checkbox=this.#createElement('input');
                checkbox.type="checkbox";
                checkbox.className="checkboxDesign";
    
                const answerTxt=this.#createElement('p');
                answerTxt.className="inputDesign2";
                answerTxt.textContent=answer;
    
                answerDiv.appendChild(checkbox);
                answerDiv.appendChild(answerTxt);
                questiontionContener.appendChild(answerDiv);
                
            });
            contener.appendChild(questiontionContener);


            btn_convalidar.addEventListener("click",()=>{

                this.checkQuiz(question,questiontionContener);
                new Navigation('.section_result');
                
            },{once:true});
         
        });
       
        
      
    }

    appendDOM() {
        // Pobieramy listę kluczy quizów z localStorage
        const quizKeys = JSON.parse(localStorage.getItem('quizKeys')) || [];
        console.log("QUIZ KEY--->",quizKeys);

        quizKeys.forEach(key => {
            // Pobieramy każdy quiz z localStorage
            const storedQuiz = localStorage.getItem(key);
            if (storedQuiz) {
                const quiz = JSON.parse(storedQuiz);

                // Tworzymy elementy DOM z informacjami o quizie
                this.#crearDOM_div("mine_quiz", "txt2","txt3","txt4","div", "p",".mine_quizContener",quiz);

              
            }
        });
    }
}

class Navigation{
    #purposeElement;

    constructor(purposeElement){
        this.#purposeElement=purposeElement;

        this.scroll();
    }
    #getElement(element){ 
        return document.querySelector(element);
    }
    scroll(){
        const purposeElement=this.#getElement(this.#purposeElement);

        purposeElement.scrollIntoView({
            behavior:"smooth",
                
        })


    }
    

}

class Results{
    #aciertas;
    #perdidas;
    constructor(){
        this.reset();
        this.#aciertas = 0;
        this.#perdidas = 0;
    }

    win(){
        this.#aciertas++;
        localStorage.setItem("Aciertas",this.#aciertas);
    };
    loose(){
        this.#perdidas++
        localStorage.setItem("Perdidas",this.#aciertas);
    };
    drawResults(table,color){
        table.forEach(item=>item.style.backgroundColor=color);
    };
    drawCorrect(table){
        console.log("Table elements: ", table);
        table.forEach(item=>{
            item.innerHTML+='<i class="fa-solid fa-check bird"></i>';
        })
    }
    #getAllCorrect(contener){
        return contener.querySelectorAll('[data-true="true"]');
    }
    #showAllCorrect(){
        const elements=this.#getAllCorrect(document);
        this.drawCorrect(elements);

    }
    crearSection(){
        const section_result=document.querySelector('.section_result');
        section_result.style.display="block";

        const h2=section_result.querySelector('h2');
        h2.textContent=`${this.#showTxt()}`;
        const h1=section_result.querySelector('h1');
        h1.textContent=`${this.#calculatePercent() || 0}%`;


        const button=section_result.querySelector('button');

        button.addEventListener("click",()=>{
            new Navigation('.my_quiz_a');
            this.#showAllCorrect();
        });
        
    };

    showResults(){
        console.log("PUNKTY WYGRANE: ",this.#aciertas);
        console.log("PUNKTY PRZEGRANE: ",this.#perdidas);

        this.crearSection();
    };

    #calculatePercent(){
        const maxPoints=this.#aciertas+this.#perdidas;
        return Math.round((this.#aciertas/maxPoints)*100);
    }
    #showTxt(){
        const result=this.#calculatePercent();

        if(result>50){
            return "ENHORABUENA!"
        }
        else if(result===50){
            return "CASI LO HAS HECHO"
        }
        else{
            return "QUE PENA.."
        }
    }
    reset() {
        this.#aciertas = 0;
        this.#perdidas = 0;
        localStorage.removeItem("Aciertas");
        localStorage.removeItem("Perdidas");
    }
    

}













