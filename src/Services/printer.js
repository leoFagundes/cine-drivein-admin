import qz from "qz-tray";

const privateKey = `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCw96Il/Mu+aDJN
D+Djmy9dTUQyvuERJBHT/13+W1c+o6KlV4Z+sT8DchQHjSXinR2uQB6edkqM5Z6r
UI+fyumZj4TaF9XUaFtvpbJ4twkSYJozPqpTIcNENdUXKTzKFHtd2xSfSgFAMPrN
cc+ueNYpf7HcE6g99a3dhRS79K60N60P0RfMjfJFUVc6rSOJMYcXdUdjKe+nnNlf
HRviuT5FLg02psrM8w2HIDw3qhgSFip+Y62O8ZY0zNoKsVQWbG6oRILHCDBd9Q+3
XU23mrkrsyF6RsIJex/lrMMK7kqCLQlY80OA+OzAhjbBKkjK82283QfZzTL3G7Nh
j+UHV5wTAgMBAAECggEAAu2uILvMsVNvFahgG9QbFgurx70x40M6CkyNBSME0BQM
InlOz/Tl6owuOavDxzq7XYFRIGUruaYpGIOmRMoqUHC4DZXcY33wmWngCLBatZOk
qZltXx/NZ+kOJCp6B4wMOJLiBfrHB4Vn+RNbkPMN9DTZQB+RJqlUnbhQjgWwCGpm
ZTigZXAqdKRgvbXX8CtcytxwF7m6vd9eY6wEwn/8rWGDuwDVXcgosgVMblrVbvkx
FnvwCZiVkRGxbz4a/mRlNqeGiLYf+q/OhwhS1rJwgbAcC3cfz2KsbuLkXPdIoaxQ
JyI/gk1eS2CDPua7uUJ/BsAENZm1k+z5E3OYHb/LdQKBgQDeJgiF+Y4DLw5xLi/o
H9HzrqXR7exMScxkEz9wkQq/BW2Nhmhk9M5WhRJrEfwnNLUEfqyk1weKlJHn0UZj
qCJvmnBEpbBdnMiiy7o2P/AXTk9gdRe4nZioLYSyZxe5L38aOGjlcndwhpvOwCJh
KUnRudtcE40eNzsl95Jg0c/l/wKBgQDL7xbpYoFvMPmDecMRoIn02MNuVnpPx4pJ
2liNGY+IQA+M5zqm2Y3DmC93SunUlXi9RIS/41HApIkyci3dEzLWjyFFCbM/vNto
l2axQF1G1gtqQL9RiJGpgzQpsfd5X6zptd4h+BwT1SqVdvHN5z8U7ld8awjrpPR/
n2qOoeZR7QKBgEzamZ5IDOJ7GCL92KMUxxzn8gQjrNljuqtwoUT/WNlnNlR9CIbM
zsnN9eZG7ZZevLVWYcIRhlFiPuwVUaXOmENGCcsmC1MHl74Cf2SfUB+v/vQe7lr3
YsXkIYFa+zEdBnr6wweGR14No7+uZvZ4Q0qkYwiC1xJ6ByOGeAS48ZTfAoGALU9c
1tPVEEBgX67RAXyayjTTDxPVrx4Vgp0pqYfxVQNusQ67AFE75yZL/YQ+ecYQAnVT
zVKTWmr0NKobuI/IbtV0PeOO2O18Djv9TAqR7ugltyDVoSbnvjLxhwYMhwIT6AVJ
amC21E07XeQEi4wCfwMJmxIo9Do9PJHN2gzsoG0CgYAbfzRZhZrjBiTTB66UAedC
8EZqgvESWh1vyyZGSnPblDHSIpQTAW7m5JVVTxS2Lcl95fp4aa0B/wtd0ap5m9MZ
XsIdM+OkJeOPRVtJQCHm8Ns3a0GS1hT0J/Doxv4h9YQFsvwzFk3e6WJvJVz91xce
X1JmJybkkThh0C1zLSUatQ==
-----END PRIVATE KEY-----`;

const certificate = `-----BEGIN CERTIFICATE-----
MIIECzCCAvOgAwIBAgIGAZBaT4FWMA0GCSqGSIb3DQEBCwUAMIGiMQswCQYDVQQG
EwJVUzELMAkGA1UECAwCTlkxEjAQBgNVBAcMCUNhbmFzdG90YTEbMBkGA1UECgwS
UVogSW5kdXN0cmllcywgTExDMRswGQYDVQQLDBJRWiBJbmR1c3RyaWVzLCBMTEMx
HDAaBgkqhkiG9w0BCQEWDXN1cHBvcnRAcXouaW8xGjAYBgNVBAMMEVFaIFRyYXkg
RGVtbyBDZXJ0MB4XDTI0MDYyNjE1Mjc1OFoXDTQ0MDYyNjE1Mjc1OFowgaIxCzAJ
BgNVBAYTAlVTMQswCQYDVQQIDAJOWTESMBAGA1UEBwwJQ2FuYXN0b3RhMRswGQYD
VQQKDBJRWiBJbmR1c3RyaWVzLCBMTEMxGzAZBgNVBAsMElFaIEluZHVzdHJpZXMs
IExMQzEcMBoGCSqGSIb3DQEJARYNc3VwcG9ydEBxei5pbzEaMBgGA1UEAwwRUVog
VHJheSBEZW1vIENlcnQwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCw
96Il/Mu+aDJND+Djmy9dTUQyvuERJBHT/13+W1c+o6KlV4Z+sT8DchQHjSXinR2u
QB6edkqM5Z6rUI+fyumZj4TaF9XUaFtvpbJ4twkSYJozPqpTIcNENdUXKTzKFHtd
2xSfSgFAMPrNcc+ueNYpf7HcE6g99a3dhRS79K60N60P0RfMjfJFUVc6rSOJMYcX
dUdjKe+nnNlfHRviuT5FLg02psrM8w2HIDw3qhgSFip+Y62O8ZY0zNoKsVQWbG6o
RILHCDBd9Q+3XU23mrkrsyF6RsIJex/lrMMK7kqCLQlY80OA+OzAhjbBKkjK8228
3QfZzTL3G7Nhj+UHV5wTAgMBAAGjWzBZMB0GA1UdDgQWBBQbkCZ6REapOjdfKn6h
gF1wqWkFuDAfBgNVHSMEGDAWgBQbkCZ6REapOjdfKn6hgF1wqWkFuDAPBgNVHRMB
Af8EBTADAQH/MA0GCSqGSIb3DQEBCwUAA4IBAQA/NupJGsB7XY8AwnWgi5ExRrkF
tUYN4/5dudD91dT8HcE98iF7/f+TAnEM+Ab+eCv8REckkiQuSCYlUtlIDGuNqlrq
GsLQtxLtsoITQEVHykh0f7UcoTPwMAy+KjRMt/j/0kdlv0PH77eyXDO/MjSzJZVL
CrQ0ib6M1aiRCn9RtIXLz6FQFWKzL0WcAjpyVd0SZc6UOpUtJt4u53ChP7Khvv2T
k+oj+jiZYW0NcS6NqW4a8nhoMhhCyO+UBoDsK68PUH60J7s+E+GhAXoRQsafh0L6
RYyRYVo+/GrHGx2KmDLXt8h2eSTtD6XbAak02ZNhKy+YlL9OHh6kAN61BBUj
-----END CERTIFICATE-----`;

qz.security.setCertificatePromise((resolve, reject) => {
  resolve(certificate);
});

qz.security.setSignaturePromise((toSign) => {
  return (resolve, reject) => {
    // A simple, insecure signature implementation for development
    const signature = "dummy-signature";
    resolve(signature);
  };
});

export const connectWithPrinter = async (setConnectedPrinter) => {
  try {
    console.log("Tentando conectar a impressora...");
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

export const printDailyReport = (
  connectedPrinter,
  reportData,
  groupedItems,
  isDetailedReport = false
) => {
  if (connectedPrinter) {
    const config = qz.configs.create(connectedPrinter);

    const {
      totalMoney,
      totalPix,
      totalCredit,
      totalDebit,
      subtotal,
      serviceFee,
      total,
    } = reportData;

    const today = new Date();
    const date = today.toLocaleDateString("pt-BR");

    let data = [
      "\x1B" + "\x40", // init
      "\x1B" + "\x61" + "\x31", // center align
      "\x1B" + "\x21" + "\x30", // double height + width
      `Relatorio diario` + "\x0A",
      `${date}` + "\x0A",
      "\x0A",
      "\x1B" + "\x21" + "\x00", // normal text
      "\x1B" + "\x61" + "\x30", // left align
      `Total em dinheiro: R$ ${totalMoney.toFixed(2)}` + "\x0A",
      `Total em pix: R$ ${totalPix.toFixed(2)}` + "\x0A",
      `Total em crédito: R$ ${totalCredit.toFixed(2)}` + "\x0A",
      `Total em débito: R$ ${totalDebit.toFixed(2)}` + "\x0A",
      `Subtotal: R$ ${subtotal.toFixed(2)}` + "\x0A",
      `Taxa de serviço: R$ ${serviceFee.toFixed(2)}` + "\x0A",
      `Total: R$ ${total.toFixed(2)}` + "\x0A",
      "\x0A",
      "\x1B" + "\x61" + "\x31", // center align
      "------------------------------------------" + "\x0A" + "\x0A",
    ];

    // Object.entries(groupedItems.allItems).forEach(([codItem, items]) => {
    //   data.push(
    //     "\x1B" + "\x61" + "\x30", // left align
    //     `${items.length}x ${items[0].name} (${items[0].cod_item})` + "\x0A"
    //   );
    // });

    const getAdditionalItemsToDetailedReport = (itemsByCodeitem) => {
      const additionalGrouped = {};

      itemsByCodeitem.forEach((item) => {
        const additions = [
          { category: "Adicional", value: item.additional },
          { category: "Bebida", value: item.additional_drink },
          { category: "Molho", value: item.additional_sauce },
          { category: "Doce", value: item.additional_sweet },
        ];

        additions.forEach(({ category, value }) => {
          if (value) {
            if (!additionalGrouped[category]) {
              additionalGrouped[category] = {};
            }
            additionalGrouped[category][value] =
              (additionalGrouped[category][value] || 0) + item.quantity;
          }
        });
      });

      return Object.entries(additionalGrouped).map(([category, items]) => {
        const formattedItems = Object.entries(items)
          .map(([name, count]) => `${count}x ${name}`)
          .join(", ");
        return `${category}: ${formattedItems}`;
      });
    };

    if (isDetailedReport) {
      Object.entries(groupedItems.allItems)
        .sort(([, itemsA], [, itemsB]) => itemsB.length - itemsA.length)
        .forEach(([codItem, items]) => {
          const additionalReport = getAdditionalItemsToDetailedReport(items);
          data.push(
            "\x1B" + "\x61" + "\x30", // left align
            `${items.length}x ${items[0].name} (${items[0].cod_item})` + "\x0A",
            `${additionalReport ? additionalReport.join("\x0A") + "\x0A" : ""}`,
            `${additionalReport ? "\x0A" : ""}`
          );
        });
    } else {
      Object.entries(groupedItems.allItems)
        .sort(([, itemsA], [, itemsB]) => itemsB.length - itemsA.length)
        .forEach(([codItem, items]) => {
          data.push(
            "\x1B" + "\x61" + "\x30", // left align
            `${items.length}x ${items[0].name} (${items[0].cod_item})` + "\x0A"
          );
        });
    }

    data.push(
      "\x0A",
      "\x1B" + "\x61" + "\x31", // center align
      "------------------------------------------" + "\x0A" + "\x0A",
      "Cine Drive-in",
      "\x1B" + "\x61" + "\x30",
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

export const printOrder = (connectedPrinter, order, groupedItems) => {
  if (connectedPrinter) {
    const config = qz.configs.create(connectedPrinter);
    const createdAtDate = new Date(order.createdAt ? order.createdAt : "");

    const dia = createdAtDate.getDate().toString().padStart(2, "0");
    const mes = (createdAtDate.getMonth() + 1).toString().padStart(2, "0");
    const ano = createdAtDate.getFullYear();

    const hora = createdAtDate.getHours().toString().padStart(2, "0");
    const minuto = createdAtDate.getMinutes().toString().padStart(2, "0");
    const segundo = createdAtDate.getSeconds().toString().padStart(2, "0");
    const dataHoraFormatada = `${dia}/${mes}/${ano} ${hora}:${minuto}:${segundo}`;

    let data = [
      "\x1B" + "\x40", // init
      "\x1B" + "\x61" + "\x31", // center align
      "\x1B" + "\x21" + "\x30", // double height + width
      "\x1B" + "\x45" + "\x0D", // bold
      `Vaga: ${order.spot}` + "\x0A",
      "\x0A",
      "\x1B" + "\x21" + "\x00", // normal text
      "\x1B" + "\x61" + "\x30", // left align
      `Número da Comanda: ${order.order_number}` + "\x0A",
      `Telefone: ${order.phone}` + "\x0A",
      `Nome: ${order.username}` + "\x0A",
      `Criado em ${dataHoraFormatada}` + "\x0A",
      "\x0A",
      "\x1B" + "\x45" + "\x0A", // bold off
      "\x1B" + "\x61" + "\x31",
      "------------------------------------------" + "\x0A",
      "\x1B" + "\x61" + "\x30",
    ];

    // Constante para o comprimento máximo da linha
    const LINE_LENGTH = 45;

    // Encontrar o comprimento máximo dos nomes dos itens
    const maxNameLength = Math.max(
      ...order.items.map((item) => item.item.name.length)
    );

    // Adicionar itens da ordem
    // order.items.forEach((itemInOrder) => {
    //   const item = itemInOrder.item;

    //   // Preenche o nome do item com espaços até atingir maxNameLength
    //   const itemName = item.name.padEnd(maxNameLength, " ");

    //   // Calcula quantos espaços são necessários para alinhar o valor à direita
    //   const spacesNeeded =
    //     LINE_LENGTH - itemName.length - item.value.toFixed(2).length;

    //   // Preenche o valor com espaços no começo para alinhar à direita
    //   const formattedValue = " ".repeat(spacesNeeded) + item.value.toFixed(2);

    //   data.push(
    //     `1x` + itemName + formattedValue,
    //     "\x0A" // Quebra de linha
    //   );
    // });

    // Adicionar itens da ordem
    groupedItems.forEach((item) => {
      // Preenche o nome do item com espaços até atingir maxNameLength
      const itemName = item.item.name.padEnd(maxNameLength, " ");

      // Calcula quantos espaços são necessários para alinhar o valor à direita
      const spacesNeeded =
        LINE_LENGTH - itemName.length - item.totalValue.toFixed(2).length;

      // Preenche o valor com espaços no começo para alinhar à direita
      const formattedValue =
        " ".repeat(spacesNeeded) + item.totalValue.toFixed(2);

      data.push(
        "\x1B" + "\x45" + "\x0D", // bold
        `x${item.quantity} ` + itemName + formattedValue,
        `${
          item.observations.length > 0
            ? "Observacao: " + item.observations[0] + "\x0A"
            : ""
        }`,
        `${item.additional ? "Complemento: " + item.additional + "\x0A" : ""}`,
        `${
          item.additional_sauce
            ? "Molho: " + item.additional_sauce + "\x0A"
            : ""
        }`,
        `${
          item.additional_drink
            ? "Bebida: " + item.additional_drink + "\x0A"
            : ""
        }`,
        `${
          item.additional_sweet
            ? "Bomboniere: " + item.additional_sweet + "\x0A"
            : ""
        }`,
        `${
          item.observations.length === 0 &&
          !item.additional &&
          !item.additional_sauce &&
          !item.additional_drink &&
          !item.additional_sweet
            ? "\x0A" + "\x0A"
            : "\x0A"
        }`,
        "\x1B" + "\x45" + "\x0A" // bold off
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
      "\x1B" + "\x45" + "\x0D", // bold
      formatLine("Valor:", order.total_value.toFixed(2)) + "\x0A",
      formatLine("Taxa de serviço:", order.service_fee.toFixed(2)) + "\x0A",
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
