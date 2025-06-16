// 할일 목록을 저장할 배열
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// DOM 요소
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');
const quoteElement = document.getElementById('quote');
const authorElement = document.getElementById('author');
const calendar = document.getElementById('calendar');
const currentMonthElement = document.getElementById('currentMonth');
const prevMonthButton = document.getElementById('prevMonth');
const nextMonthButton = document.getElementById('nextMonth');

// 현재 날짜 정보
let currentDate = new Date();
let selectedDate = new Date();

// 명언 목록
const quotes = [
    {
        text: "시간은 가장 귀중한 자산이다. 그것을 어떻게 사용하느냐가 당신의 미래를 결정한다.",
        author: "브라이언 트레이시"
    },
    {
        text: "오늘 할 수 있는 일을 내일로 미루지 마라.",
        author: "벤자민 프랭클린"
    },
    {
        text: "작은 진전이라도 매일 이루어내면 그것이 큰 변화로 이어진다.",
        author: "로버트 콜리어"
    },
    {
        text: "성공의 비결은 단순하다. 매일 조금씩이라도 발전하라.",
        author: "로버트 브라운"
    },
    {
        text: "시간을 낭비하는 것은 가장 큰 낭비다.",
        author: "테오프라스투스"
    }
];

// 달력 렌더링 함수
function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // 현재 월 표시
    currentMonthElement.textContent = `${year}년 ${month + 1}월`;
    
    // 달력 초기화
    calendar.innerHTML = '';
    
    // 월의 첫 날과 마지막 날
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // 첫 날의 요일 (0: 일요일, 6: 토요일)
    const firstDayIndex = firstDay.getDay();
    
    // 이전 달의 마지막 날짜들
    const prevLastDay = new Date(year, month, 0).getDate();
    
    // 이전 달의 날짜들 추가
    for (let i = firstDayIndex - 1; i >= 0; i--) {
        const dayElement = document.createElement('div');
        dayElement.textContent = prevLastDay - i;
        dayElement.style.color = '#ccc';
        calendar.appendChild(dayElement);
    }
    
    // 현재 달의 날짜들 추가
    for (let i = 1; i <= lastDay.getDate(); i++) {
        const dayElement = document.createElement('div');
        dayElement.textContent = i;
        
        // 오늘 날짜 표시
        if (i === new Date().getDate() && 
            month === new Date().getMonth() && 
            year === new Date().getFullYear()) {
            dayElement.classList.add('today');
        }
        
        // 선택된 날짜 표시
        if (i === selectedDate.getDate() && 
            month === selectedDate.getMonth() && 
            year === selectedDate.getFullYear()) {
            dayElement.classList.add('selected');
        }
        
        // 날짜 클릭 이벤트
        dayElement.addEventListener('click', () => {
            selectedDate = new Date(year, month, i);
            renderCalendar();
            renderTodos();
        });
        
        calendar.appendChild(dayElement);
    }
}

// 랜덤 명언 표시 함수
function displayRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    quoteElement.textContent = quote.text;
    authorElement.textContent = `- ${quote.author}`;
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    renderTodos();
    displayRandomQuote();
    renderCalendar();
    
    // 이전 달 버튼 클릭 이벤트
    prevMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    
    // 다음 달 버튼 클릭 이벤트
    nextMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
});

// 할일 추가 함수
function addTodo() {
    const todoText = todoInput.value.trim();
    if (todoText) {
        const todo = {
            id: Date.now(),
            text: todoText,
            completed: false,
            date: selectedDate.toISOString()
        };
        todos.push(todo);
        saveTodos();
        renderTodos();
        todoInput.value = '';
    }
}

// 할일 삭제 함수
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}

// 할일 완료 상태 토글 함수
function toggleTodo(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    saveTodos();
    renderTodos();
}

// 할일 목록 렌더링 함수
function renderTodos() {
    todoList.innerHTML = '';
    const selectedDateStr = selectedDate.toISOString().split('T')[0];
    
    todos
        .filter(todo => todo.date.split('T')[0] === selectedDateStr)
        .forEach(todo => {
            const todoItem = document.createElement('div');
            todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            todoItem.innerHTML = `
                <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleTodo(${todo.id})">
                <span>${todo.text}</span>
                <button class="delete-btn" onclick="deleteTodo(${todo.id})">
                    <i class="fas fa-trash"></i> 삭제
                </button>
            `;
            todoList.appendChild(todoItem);
        });
}

// 로컬 스토리지에 할일 목록 저장
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Enter 키로 할일 추가
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});
