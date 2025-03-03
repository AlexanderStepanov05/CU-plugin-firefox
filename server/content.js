// Функция для удаления нежелательных курсов
function removeUnwantedCourses() {
    const unwantedCourses = [
        "Онбординг по платформам ЦУ",
        "Онбординговая неделя",
        "Математический буткемп",
        "ОРГ: Восток",
        "ОРГ: Юг",
        "ОРГ: Север",
        "ОРГ: Запад",
        "English 104",
        "English 103",
        "English 102",
        "English 101",
        "Большие идеи в компьютерных науках",
        "Ознакомление с локально-нормативными актами и приказами ЦУ",
        "Бизнес-студия: Восток",
        "Опросы бакалавриат",
        "🔵🔴⚫️ Введение в статистику",
        "🔵🔴⚫️ Линейная алгебра",
        "🔵 Дискретная математика",
        "Мастерская технологического предпринимательства",
        "🔵🔴⚫️ Математический анализ",
        "Научная студия. Лесные пожары",
        "ОРГ_1",
        "ОРГ_2",
        "ОРГ_3",
        "ОРГ_4",
        '🔵🔴 Основы бизнес-аналитики',
        "⚫️ Основы бизнес-аналитики",
        "⚫️ Разработка на Python",
        "🔵🔴 Разработка на Python",
        "Физическая культура",
        "Физическая культура. Рефераты"
    ];
    
    if (window.location.href.includes('courses/view')) {
        const courseElements = document.querySelectorAll('.course-card');
        courseElements.forEach(courseElement => {
            const courseTitleElement = courseElement.querySelector('.course-card__title');
            if (courseTitleElement) {
                const courseTitle = courseTitleElement.innerText.trim();
                if (unwantedCourses.includes(courseTitle)) {
                    courseElement.closest('li').remove();
                }
            }
            courseElement.classList.add("turned-on");
        });
    } 
    if (window.location.href.includes('tasks/actual-student-tasks')) {
        const listItems2024 = document.querySelectorAll('tr');
        listItems2024.forEach(item => {
            const text = item.textContent;

            if (text.includes("Seminar") ||
                text.includes("Суммарная оценка за аудиторную работу") ||
                text.includes("Посещение") ||
                text.includes("Пересдача")) {
                item.remove();
            }
        });
    }
}

// Функция добавления обработчика правого клика
function addRightClickHandlers() {
    document.querySelectorAll('li').forEach(li => {
        if (li.classList.contains('has-right-click')) return;

        const titleElement = li.querySelector('.course-card__title');
        if (!titleElement) return;

        const courseKey = 'completed_' + titleElement.innerText.trim();

        // Добавляем обработчик правого клика
        li.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            const isCompleted = !this.classList.toggle('completed');

            browser.storage.local.set({ [courseKey]: isCompleted });
        });

        li.classList.add('has-right-click');
    });
}

// Основная функция
function cleanAndAddRightClick() {
    removeUnwantedCourses();
    addRightClickHandlers();
}

// Инициализация при загрузке страницы
browser.storage.sync.get(["autoClean"]).then((data) => {
    if (data.autoClean) {
        cleanAndAddRightClick();
    }
}).catch((error) => {
    console.error("Error getting autoClean state:", error);
});

// Слушаем изменения состояния autoClean в хранилище
browser.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "sync" && "autoClean" in changes) {
        const autoCleanEnabled = changes.autoClean.newValue;
        if (autoCleanEnabled) {
            cleanAndAddRightClick();
        }
    }
});

// Обработчик сообщений от background.js
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "cleanAndAddRightClick") {
        cleanAndAddRightClick();
    }
    return true; // Для асинхронной обработки сообщений
});

// Очистка состояний
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "clearCheckboxes") {
        document.querySelectorAll('.ng-star-inserted.has-right-click.completed').forEach(course => {
            course.classList.remove('completed');
            const courseTitle = course.querySelector('.course-card__title').innerText.trim();
            const courseKey = 'completed_' + courseTitle;
            browser.storage.local.remove(courseKey); 
        }); 
    }
    return true; // Для асинхронной обработки сообщений
});
