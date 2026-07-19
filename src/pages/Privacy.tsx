import { Link } from "react-router-dom"
import { useEffect } from "react"
import { Logo } from "@/components/Logo"

export default function Privacy() {
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = "Политика конфиденциальности — Русский Стол"
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-6 md:px-12 py-6 flex items-center justify-between">
          <Link to="/">
            <Logo size={56} />
          </Link>
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            На главную
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 md:px-12 py-16 md:py-24 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-light mb-4">
          Политика конфиденциальности
        </h1>
        <p className="text-sm text-muted-foreground mb-12">
          Дата последнего обновления: 6 июля 2026 года
        </p>

        <div className="space-y-10 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-xl font-medium text-foreground mb-3">
              1. Общие положения
            </h2>
            <p>
              Настоящая Политика конфиденциальности регулирует порядок обработки и
              защиты персональных данных пользователей сайта russiantable.ru
              (далее — «Сайт»), принадлежащего мастерской «Русский Стол» (далее —
              «Мы»). Оставляя свои данные на Сайте, пользователь подтверждает своё
              согласие с условиями настоящей Политики.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-3">
              2. Какие данные мы собираем
            </h2>
            <p className="mb-3">
              Мы собираем персональные данные, которые пользователь предоставляет
              добровольно при оформлении заявки или обращении к нам:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>имя;</li>
              <li>номер телефона;</li>
              <li>адрес электронной почты (при наличии);</li>
              <li>содержание заказа и сообщения.</li>
            </ul>
            <p className="mt-3">
              Также автоматически могут собираться технические данные:
              IP-адрес, тип браузера, данные систем веб-аналитики (Яндекс.Метрика).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-3">
              3. Цели обработки данных
            </h2>
            <p className="mb-3">Мы обрабатываем персональные данные для того, чтобы:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>связаться с пользователем по оставленной заявке;</li>
              <li>обработать и выполнить заказ;</li>
              <li>консультировать по продукции и услугам;</li>
              <li>улучшать работу Сайта и качество обслуживания.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-3">
              4. Хранение и защита данных
            </h2>
            <p>
              Мы принимаем необходимые организационные и технические меры для защиты
              персональных данных от несанкционированного доступа, изменения,
              раскрытия или уничтожения. Данные хранятся не дольше, чем это необходимо
              для достижения целей обработки, либо до момента отзыва согласия.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-3">
              5. Передача данных третьим лицам
            </h2>
            <p>
              Мы не передаём персональные данные третьим лицам, за исключением случаев,
              когда это необходимо для выполнения заказа (например, службам доставки),
              либо когда этого требует законодательство Российской Федерации.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-3">
              6. Права пользователя
            </h2>
            <p>
              Пользователь вправе в любой момент запросить информацию об обработке своих
              персональных данных, потребовать их исправления или удаления, а также
              отозвать согласие на обработку, направив соответствующее обращение на
              нашу электронную почту.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-3">
              7. Контакты
            </h2>
            <p>
              По всем вопросам, связанным с обработкой персональных данных, вы можете
              связаться с нами по адресу:{" "}
              <a
                href="mailto:russian_table@mail.ru"
                className="text-foreground underline hover:opacity-70 transition-opacity"
              >
                russian_table@mail.ru
              </a>
              .
            </p>
            <p className="mt-4">
              Оператор персональных данных: ИП Городничев Иван Андреевич (г. Санкт-Петербург),
              ИНН 781904681926, ОГРНИП 326784700242304.
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-border">
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Вернуться на главную
          </Link>
        </div>
      </main>
    </div>
  )
}