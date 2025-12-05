// Модальные окна
    function openModal(type){
      const back = document.getElementById('modalBack');
      const content = document.getElementById('modalContent');
      back.style.display = 'flex';
      back.setAttribute('aria-hidden','false');
      if(type==='register'){
        content.innerHTML = `
          <h3>Регистрация</h3>
          <form id="regForm">
            <div class="form-row"><input name="name" placeholder="Имя" required></div>
            <div class="form-row"><input name="email" type="email" placeholder="Email" required></div>
            <div class="form-row"><input name="password" type="password" placeholder="Пароль" required></div>
            <div class="form-actions"><button type="button" class="btn" onclick="submitRegister()">Зарегистрироваться</button><button type="button" onclick="closeModal()">Отмена</button></div>
          </form>
          <p class="muted">Уже есть аккаунт? <a href="#" onclick="openModal('login')">Войти</a></p>
        `;
      } else {
        content.innerHTML = `
          <h3>Вход</h3>
          <form id="loginForm">
            <div class="form-row"><input name="email" type="email" placeholder="Email" required></div>
            <div class="form-row"><input name="password" type="password" placeholder="Пароль" required></div>
            <div class="form-actions"><button type="button" class="btn" onclick="submitLogin()">Войти</button><button type="button" onclick="closeModal()">Отмена</button></div>
          </form>
          <p class="muted">Нет аккаунта? <a href="#" onclick="openModal('register')">Зарегистрироваться</a></p>
        `;
      }
    }
    function closeModal(e){
      if(e && e.target && e.target.id !== 'modalBack') return;
      const back = document.getElementById('modalBack');
      back.style.display='none';
      back.setAttribute('aria-hidden','true');
      document.getElementById('modalContent').innerHTML='';
    }

    // Обработчики отправки форм выполняют запросы к серверным конечным точкам
    async function submitRegister(){
      const form = document.getElementById('regForm');
      const data = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        password: form.password.value
      };
      // базовая проверка клиента
      if(!data.email || !data.password || !data.name){ alert('Заполните все поля'); return; }
      try{
        const res = await fetch('/api/register',{
          method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)
        });
        if(res.ok){
          const json = await res.json();
          alert('Успешная регистрация');
          closeModal();
        } else {
          const err = await res.json().catch(()=>({message:'Ошибка'}));
          alert('Ошибка регистрации: '+(err.message||res.statusText));
        }
      }catch(e){
        alert('Не могу отправить запрос: '+e.message);
      }
    }

    async function submitLogin(){
      const form = document.getElementById('loginForm');
      const data = {email: form.email.value.trim(), password: form.password.value};
      if(!data.email||!data.password){ alert('Заполните все поля'); return; }
      try{
        const res = await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
        if(res.ok){
          const json = await res.json();
          // предполагаем ответ: { token: '...' }
          // сохранить токен в localStorage
          if(json.token) localStorage.setItem('auth_token', json.token);
          alert('Вход выполнен');
          closeModal();
        } else {
          const err = await res.json().catch(()=>({message:'Ошибка'}));
          alert('Ошибка входа: '+(err.message||res.statusText));
        }
      }catch(e){
        alert('Вы не зарегистрированы');
      }
    }

    // Закрыть модальное окно клавишей Esc
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape'){ closeModal(); } });