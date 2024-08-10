const quizSystem = new QuizSystem();

quizSystem.createQuiz(".btn", "#quiz-title", "#quiz-author", ".quiz-a", ".quiz-b");

if(document.querySelector(".btn")){
    document.querySelector(".btn").addEventListener("click", () => {
        quizSystem.createPreguntas(".goPrev", ".quiz-b", ".quiz-a", ".title_inf", ".author_inf");
    });
}

quizSystem.addOption(".btnAddOptions", ".optionsDiv");

quizSystem.section_b(".option", ".goNext", ".goPrev", ".quiz-b", ".quiz-c", "#question-value", ".quiz-a", ".number_of_questions");

quizSystem.chooce_btns(".btn_crear-otro", ".btn_terminar", ".quiz-b", ".quiz-d", ".quiz-c",
    //DO FUNKCJI SECTION_D:
    ".author_place_d",".title_place_d",".questionsList",".cantidad_place_d"
);

quizSystem.buttonsDel(".delateBtn_b");

quizSystem.goTo_b(".goTo_b",".questionsList");

quizSystem.section_e(".btn_convalidar",".quiz-d",".quiz-e");
