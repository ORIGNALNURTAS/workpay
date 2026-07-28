# WorkPay + Firebase — баптау нұсқаулығы

Бұл нұсқада деректер (жазбалар, ставка, мақсат) енді браузерде емес,
Firebase бұлтында сақталады. Сондықтан кез келген құрылғыда (iPhone,
Samsung, ноутбук) сол email-мен кірсеңіз, барлық деректеріңіз бірден
көрінеді.

Баптау шамамен 10-15 минут алады, бір рет қана жасалады.

## 1-қадам: Firebase жобасын құру

1. https://console.firebase.google.com сайтын ашыңыз, Google
   аккаунтыңызбен кіріңіз (тегін)
2. **«Add project» / «Жоба қосу»** басыңыз
3. Жоба атын жазыңыз, мысалы `workpay` → **Continue**
4. Google Analytics сұраса, өшіріп қоюға болады (керек емес) →
   **Create project**
5. Жоба дайын болғанша күтіңіз → **Continue**

## 2-қадам: Web қосымша тіркеу

1. Жоба бетінде **`</>`** (Web) белгішесін басыңыз
2. Қосымша атын жазыңыз (мысалы `workpay-web`) → **Register app**
3. Экранда `firebaseConfig` деген JavaScript объектісі шығады —
   мысалы:
   ```js
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "workpay-xxxxx.firebaseapp.com",
     projectId: "workpay-xxxxx",
     storageBucket: "workpay-xxxxx.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef123456"
   };
   ```
4. **Осы блокты толығымен көшіріп алыңыз** — келесі қадамда керек болады
5. **Continue to console** басып жабыңыз

## 3-қадам: Authentication қосу

1. Сол жақ мәзірден **Build → Authentication** таңдаңыз
2. **Get started** басыңыз
3. **Sign-in method** қойындысында **Email/Password** тізімінен
   таңдап, **Enable** қосыңыз → **Save**

## 4-қадам: Firestore Database құру

1. Сол жақ мәзірден **Build → Firestore Database** таңдаңыз
2. **Create database** басыңыз
3. Орналасуды таңдаңыз (кез келгені жарайды, жақынырағын таңдасаңыз
   да болады, мысалы `eur3` немесе `asia-southeast1`)
4. **Start in production mode** таңдап → **Enable**

## 5-қадам: Қауіпсіздік ережелерін қою (маңызды!)

1. Firestore Database бетінде **Rules** қойындысын ашыңыз
2. Мұндағы мәтінді толығымен өшіріп, орнына мынаны қойыңыз:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;

      match /entries/{entryId} {
        allow read, write: if request.auth != null && request.auth.uid == uid;
      }
    }
  }
}
```

3. **Publish** басыңыз

Бұл ереже әркімнің тек **өз** деректерін оқып/жаза алуын қамтамасыз
етеді — біреу екіншінің жазбасын көре алмайды.

## 6-қадам: Конфигурацияны кодқа қою

1. `index.html` файлын мәтіндік редактормен ашыңыз (Notepad, VS Code,
   т.б.)
2. Файлдың басында мынаны табыңыз:
   ```js
   const firebaseConfig = {
     apiKey: "ЖОБА_КІЛТІҢІЗДІ_ОСЫ_ЖЕРГЕ_ЖАЗЫҢЫЗ",
     authDomain: "жоба-атыңыз.firebaseapp.com",
     ...
   };
   ```
3. Осы блокты толығымен өшіріп, 2-қадамда көшірген өз
   `firebaseConfig`-іңізбен ауыстырыңыз
4. Файлды сақтаңыз

## 7-қадам: Сайтқа жүктеу (GitHub Pages)

Бұрынғы GitHub репозиторийіңізге дәл сол әдіспен жүктеңіз:

1. Ескі файлдарды өшіріңіз (index.html, sw.js, т.б.)
2. Осы қалтадағы файлдардың бәрін жүктеңіз:
   `index.html`, `manifest.json`, `service-worker.js`,
   `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`
3. Commit changes
4. Settings → Pages бетінен сайт сілтемесін алыңыз (бұрынғысы
   өзгермейді)

## 8-қадам: Тексеру

1. Сайтты ашыңыз, email + парольмен (кемінде 6 таңба) **«Тіркелу»**
   басыңыз
2. Бір жазба қосып көріңіз
3. Екінші телефонда/браузерде сол сайтты ашып, **сол email/парольмен
   «Кіру»** басыңыз — жазба сол жерде де көрінуі керек

## Ықтимал қателер

- **«Firebase бапталмаған» деген қате шықса** — 6-қадамдағы
  firebaseConfig дұрыс қойылмаған, қайта тексеріңіз
- **«Missing or insufficient permissions»** — 5-қадамдағы Firestore
  ережелерін дұрыс қойылмаған, немесе әлі "Publish" баспағансыз
- **Тіркелгеннен кейін ештеңе болмайды** — Authentication бетінде
  Email/Password қосылғанын тексеріңіз (3-қадам)

## Firebase тегін ме?

Иә, бұл көлемдегі пайдалану (бірнеше пайдаланушы, күнделікті
жазбалар) Firebase-тің тегін «Spark» жоспарына толық сияды. Ақылы
жоспарға ауысу қажеттілігі әдетте тек мыңдаған пайдаланушы болғанда
туындайды.
