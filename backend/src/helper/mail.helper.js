import { getClient } from "../config/mail.config.js"

export const sendEmailReceipt = function (order) {
    const mailClient = getClient();

    mailClient.messages.create(
        'sandbox83dbc9393e63459cbaf4647f801cf681.mailgun.org',
        {
            from: 'orders@restaurant.com',
            to: order.user.email,
            subject: `Order ${order.id} Bearbetas`,
            html: getReceiptHtml(order),
        }
    )
    .then(msg => console.log(msg)) //success
    .catch(err => console.log(err)) //fail
}

const getReceiptHtml = function (order) {
    return `
  <html>
    <head>
      <style>
      table {
        border-collapse: collapse;
        max-width:35rem;
        width: 100%;
      }
      th, td{
        text-align: left;
        padding: 8px;
      }
      th{
        border-bottom: 1px solid #dddddd;
      }
      </style>
    </head>
    <body>
      <h1>Order Bekräftelse</h1>
      <p>Kära ${order.name},</p>
      <p>Tack för att du valde oss! Din betalning har bekräftats och bearbetas nu.</p>
      <p><strong>Spårnings ID:</strong> ${order.id}</p>
      <p><strong>Order Datum:</strong> ${order.createdAt
        .toISOString()
        .replace('T', ' ')
        .substr(0, 16)}</p>
        <h2>Order Detaljer</h2>
        <table>
        <thead>
          <tr>
            <th>Vara</th>
            <th>Varupris</th>
            <th>Antal Varor</th>
            <th>Totalt Pris</th>
          </tr>
        </thead>
        <tbody>
        ${order.items
          .map(
            item =>
              `
            <tr>
            <td>${item.food.name}</td>
            <td>${item.food.price} SEK</td>
            <td>${item.quantity}</td>    
            <td>${item.price.toFixed(2)} SEK</td>
            </tr>
            `
          )
          .join('\n')}
          </tbody>
          <tfoot>
          <tr>
          <td colspan="3"><strong>Totalt:</strong></td>
          <td>${order.totalPrice} SEK</td>
          </tr>
          </tfoot>
          </table>
          <p><strong>Leveransadress:</strong> ${order.address}</p>
        </body>
      </html>
    
    `;
};