import { Link } from "react-router-dom"
import { useEffect } from "react"
import { Logo } from "@/components/Logo"
import { Seo } from "@/components/Seo"

export default function Offer() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Публичная оферта — Русский Стол"
        description="Публичная оферта интернет-магазина «Русский Стол»: условия заказа, оплаты, изготовления и доставки столов из массива дуба."
        path="/offer"
      />
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
          Публичная оферта
        </h1>
        <p className="text-sm text-muted-foreground mb-12">
          Дата последнего обновления: 16 сентября 2026 года
        </p>

        <div className="space-y-10 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-xl font-medium text-foreground mb-3">
              1. Общие положения
            </h2>
            <p>
              Настоящий документ является публичной офертой ИП Городничев Иван
              Андреевич (далее — «Мастерская», «Мы») и содержит все существенные
              условия изготовления и продажи столов из массива дуба через сайт
              russiantable.ru (далее — «Сайт»). В соответствии со статьёй 437
              Гражданского кодекса РФ данный документ является публичной офертой,
              и в случае принятия изложенных условий (акцепта) физическое или
              юридическое лицо, производящее акцепт настоящей оферты, оплачивает
              заказ на условиях, изложенных в оферте.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-3">
              2. Акцепт оферты
            </h2>
            <p>
              Акцептом настоящей оферты является оформление заказа на Сайте,
              оставление заявки через форму обратной связи, мессенджер или по
              телефону с последующей оплатой заказа. С момента акцепта настоящая
              оферта считается заключённым между покупателем и Мастерской
              договором на условиях, изложенных ниже.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-3">
              3. Предмет договора
            </h2>
            <p>
              Мастерская обязуется изготовить и передать в собственность
              покупателю стол из массива дуба согласно выбранной на Сайте модели,
              комплектации и индивидуальным параметрам (размер, цвет, механизм
              подъёма), а покупатель обязуется принять и оплатить заказ на
              условиях настоящей оферты.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-3">
              4. Цена и порядок оплаты
            </h2>
            <p className="mb-3">
              Цена изделия указывается на Сайте в российских рублях и включает
              стоимость материалов, изготовления и подъёмного механизма (при его
              наличии). Стоимость доставки рассчитывается отдельно и зависит от
              региона и способа доставки.
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>оплата производится безналичным переводом или иным согласованным способом;</li>
              <li>Мастерская вправе запросить предоплату для запуска изготовления заказа;</li>
              <li>окончательный расчёт производится при готовности изделия либо при получении.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-3">
              5. Сроки изготовления и доставки
            </h2>
            <p>
              Срок изготовления изделия согласовывается индивидуально при оформлении
              заказа и зависит от сложности и загруженности производства. Доставка
              осуществляется по всей России транспортными компаниями по согласованию
              с покупателем. Точные сроки и стоимость доставки уточняются менеджером
              после оформления заказа.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-3">
              6. Качество товара и гарантия
            </h2>
            <p>
              Мастерская гарантирует соответствие изделия заявленным характеристикам
              и отсутствие производственных дефектов. Так как изделия выполняются из
              массива натурального дерева, допускаются индивидуальные особенности
              текстуры и оттенка древесины, не являющиеся дефектом.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-3">
              7. Возврат и обмен
            </h2>
            <p>
              Поскольку изделия изготавливаются по индивидуальному заказу с учётом
              персональных параметров покупателя, они относятся к товарам надлежащего
              качества, не подлежащим возврату или обмену, за исключением случаев
              обнаружения производственного брака. Порядок урегулирования претензий
              по качеству согласовывается индивидуально.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-3">
              8. Ответственность сторон
            </h2>
            <p>
              Стороны несут ответственность за неисполнение или ненадлежащее
              исполнение своих обязательств по настоящей оферте в соответствии с
              действующим законодательством Российской Федерации.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-3">
              9. Персональные данные
            </h2>
            <p>
              Оформляя заказ, покупатель даёт согласие на обработку своих
              персональных данных в целях исполнения заказа в соответствии с{" "}
              <Link to="/privacy" className="text-foreground underline hover:opacity-70 transition-opacity">
                Политикой конфиденциальности
              </Link>{" "}
              Сайта.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-3">
              10. Реквизиты и контакты
            </h2>
            <p>
              По всем вопросам, связанным с настоящей офертой и оформлением заказа,
              вы можете связаться с нами по адресу:{" "}
              <a
                href="mailto:russian_table@mail.ru"
                className="text-foreground underline hover:opacity-70 transition-opacity"
              >
                russian_table@mail.ru
              </a>
              .
            </p>
            <p className="mt-4">
              Исполнитель: ИП Городничев Иван Андреевич (г. Санкт-Петербург),
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
