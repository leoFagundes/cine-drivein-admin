import qz from "qz-tray";

export const connectWithPrinter = async (setConnectedPrinter) => {
  try {
    if (!qz.websocket.isActive()) {
      await qz.websocket.connect();
      console.log("Conectado ao QZ Tray!");
    } else {
      console.log(
        "Conexão WebSocket já está ativa:",
        qz.websocket.getConnectionInfo()
      );
    }

    const printer = await qz.printers.getDefault();
    if (printer) {
      console.log("Impressora padrão encontrada:", printer);
      setConnectedPrinter(printer);
    } else {
      console.error("Nenhuma impressora padrão encontrada.");
    }
  } catch (error) {
    console.error("Erro ao conectar e obter impressora padrão:", error);
  }
};

// export const connectWithPrinter = (setConnectedPrinter) => {
//   if (!qz.websocket.isActive()) {
//     qz.websocket
//       .connect()
//       .then(() => {
//         console.log("Connected to QZ Tray!");
//         qz.printers
//           .getDefault()
//           .then((printer) => {
//             if (printer) {
//               console.log("Found default printer:", printer);
//               setConnectedPrinter(printer);
//             } else {
//               console.error("No default printer found.");
//             }
//           })
//           .catch((error) =>
//             console.error("Error finding default printer:", error)
//           );
//       })
//       .catch((error) => console.error("WebSocket connection error:", error));
//   } else {
//     console.log("WebSocket connection:", qz.websocket.getConnectionInfo());
//   }
// };

export const printOrder = (connectedPrinter, order) => {
  if (connectedPrinter) {
    const config = qz.configs.create(connectedPrinter);
    // var data = [
    //   "\x1B" + "\x40", // init
    //   "\x1B" + "\x61" + "\x31", // center align
    //   "Canastota, NY  13032" + "\x0A",
    //   "\x0A", // line break
    //   "http://qz.io" + "\x0A", // text and line break
    //   "\x0A", // line break
    //   "\x0A", // line break
    //   "May 18, 2016 10:30 AM" + "\x0A",
    //   "\x0A", // line break
    //   "\x0A", // line break
    //   "\x0A",
    //   "Transaction # 123456 Register: 3" + "\x0A",
    //   "\x0A",
    //   "\x0A",
    //   "\x0A",
    //   "\x1B" + "\x61" + "\x30", // left align
    //   "Baklava (Qty 4)       9.00" + "\x1B" + "\x74" + "\x13" + "\xAA", // print special char symbol after numeric
    //   "\x0A",
    //   "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" + "\x0A",
    //   "\x1B" + "\x45" + "\x0D", // bold on
    //   "Here's some bold text!",
    //   "\x1B" + "\x45" + "\x0A", // bold off
    //   "\x0A" + "\x0A",
    //   "\x1B" + "\x61" + "\x32", // right align
    //   "\x1B" + "\x21" + "\x30", // em mode on
    //   "DRINK ME",
    //   "\x1B" + "\x21" + "\x0A" + "\x1B" + "\x45" + "\x0A", // em mode off
    //   "\x0A" + "\x0A",
    //   "\x1B" + "\x61" + "\x30", // left align
    //   "------------------------------------------" + "\x0A",
    //   "\x1B" + "\x4D" + "\x31", // small text
    //   "EAT ME" + "\x0A",
    //   "\x1B" + "\x4D" + "\x30", // normal text
    //   "------------------------------------------" + "\x0A",
    //   "normal text",
    //   "\x1B" + "\x61" + "\x30", // left align
    //   "\x0A" + "\x0A" + "\x0A" + "\x0A" + "\x0A" + "\x0A" + "\x0A",
    //   "\x1B" + "\x69", // cut paper (old syntax)
    //   // '\x1D' + '\x56'  + '\x00' // full cut (new syntax)
    //   // '\x1D' + '\x56'  + '\x30' // full cut (new syntax)
    //   // '\x1D' + '\x56'  + '\x01' // partial cut (new syntax)
    //   // '\x1D' + '\x56'  + '\x31' // partial cut (new syntax)
    //   "\x10" + "\x14" + "\x01" + "\x00" + "\x05", // Generate Pulse to kick-out cash drawer**
    //   // **for legacy drawer cable CD-005A.  Research before using.
    //   // Star TSP100-series kick-out ONLY
    //   // '\x1B' + '\x70' + '\x00' /* drawer 1 */ + '\xC8' + '\xC8' + '\x1B' + '\x1F' + '\x70' + '\x03' + '\x00',
    //   // '\x1B' + '\x70' + '\x01' /* drawer 2 */ + '\xC8' + '\xC8' + '\x1B' + '\x1F' + '\x70' + '\x03' + '\x00',
    // ];

    let data = [
      "\x1B" + "\x40", // init
      "\x1B" + "\x61" + "\x31", // center align
      "\x1B" + "\x21" + "\x30", // double height + width
      `Mesa: ${order.spot}` + "\x0A",
      "\x0A",
      "\x1B" + "\x21" + "\x00", // normal text
      "\x1B" + "\x61" + "\x30", // left align
      `Número da Comanda: ${order.order_number}` + "\x0A",
      `Telefone: ${order.phone}` + "\x0A",
      `Nome: ${order.username}` + "\x0A",
      `Criado em ${order.createdAt}` + "\x0A",
      "\x0A",
      "\x1B" + "\x61" + "\x31",
      "------------------------------------------" + "\x0A",
      "\x1B" + "\x61" + "\x30",
      `PRODUTO`,
      `                     `,
      `VALOR`,
      "\x0A",
      "\x0A",
    ];

    // Constante para o comprimento máximo da linha
    const LINE_LENGTH = 46;

    // Encontrar o comprimento máximo dos nomes dos itens
    const maxNameLength = Math.max(
      ...order.items.map((item) => item.item.name.length)
    );

    // Adicionar itens da ordem
    order.items.forEach((itemInOrder) => {
      const item = itemInOrder.item;

      // Preenche o nome do item com espaços até atingir maxNameLength
      const itemName = item.name.padEnd(maxNameLength, " ");

      // Calcula quantos espaços são necessários para alinhar o valor à direita
      const spacesNeeded =
        LINE_LENGTH - itemName.length - item.value.toFixed(2).length;

      // Preenche o valor com espaços no começo para alinhar à direita
      const formattedValue = " ".repeat(spacesNeeded) + item.value.toFixed(2);

      data.push(
        `1x` + itemName + formattedValue,
        "\x0A" // Quebra de linha
      );
    });

    // Função para formatar linha com alinhamento à direita
    function formatLine(description, value) {
      const spacesNeeded = LINE_LENGTH - description.length - value.length;
      const formattedValue = " ".repeat(spacesNeeded) + value;
      return `${description}${formattedValue}`;
    }

    // Adicionar linhas para Valor, Taxa de serviço e Valor total
    data.push(
      "\x1B" + "\x61" + "\x31", // Centraliza o texto
      "------------------------------------------" + "\x0A",
      "\x1B" + "\x61" + "\x32", // Alinha à direita
      formatLine("Valor:", order.total_value.toFixed(2)) + "\x0A",
      formatLine("Taxa de serviço:", order.service_fee.toFixed(2)) + "\x0A",
      "\x1B" + "\x45" + "\x0D", // bold on
      formatLine(
        "Valor total:",
        (order.total_value + order.service_fee).toFixed(2)
      ) + "\x0A",
      "\x1B" + "\x45" + "\x0A", // bold off
      "\x0A" + "\x0A" + "\x0A",
      "\x1B" + "\x61" + "\x31", // Centraliza o texto
      "Cine Drive-in",
      "\x0A" + "\x0A" + "\x0A" + "\x0A" + "\x0A" + "\x0A",
      "\x1B" + "\x69" // cut paper (old syntax)
    );

    qz.print(config, data)
      .then(() => {
        console.log("Print job submitted!");
      })
      .catch((error) => {
        console.error("Failed to submit print job:", error);
      });
  } else {
    console.error("No printer connected. Cannot print.");
  }
};
