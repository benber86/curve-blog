

document.addEventListener('DOMContentLoaded', function() {
    const transactionData = [{'txHash': '0x330f9369a5326e456b7ba0a173231ecb45560332a50f3e3076275c782b8a8cb7',
        'address': '0x733D40FDB9578c0F22B414E4d89F19c209C54205',
        'sellToken': 'TERMINUS',
        'sellAmount': '18598.377',
        'buyAmount': '0.109564137357421679',
        'sellAmountNoSandwich': '18598.377',
        'buyAmountNoSandwich': '0.11184238111259255',
        'gasPrice': '13.955146533',
        'maxFee': '20.012069292',
        'maxPriority': '8.1',
        'tag': 'Trader',
        'position': 8,
        'positionNoSandwich': 5,
        'price': '5.891059061627887',
        'priceNoSandwich': '6.013555973867642'},
        {'txHash': '0x9f94a7b750527e8e2c86e90312d9f1ab32638007efd7266ffb8a9d525dd1d046',
            'sellToken': 'TERMINUS',
            'sellAmount': '195033.304364232',
            'buyAmount': '1.091947911624461579',
            'sellAmountNoSandwich': '195033.304364232',
            'buyAmountNoSandwich': '1.1140740761307741',
            'address': '0x733D40FDB9578c0F22B414E4d89F19c209C54205',
            'gasPrice': '11.855146533',
            'maxFee': '13.443793307',
            'maxPriority': '6',
            'tag': 'Trader',
            'position': 36,
            'positionNoSandwich': 33,
            'price': '5.598776656038232',
            'priceNoSandwich': '5.712224790337342'},
        {'txHash': '0xb2b8772dbb596d599cc7cda353b0d8a3c08b1fbd224dd52f575faedd9e5708ad',
            'sellToken': 'TERMINUS',
            'sellAmount': '36485.989172823',
            'buyAmount': '0.193362160814432144',
            'sellAmountNoSandwich': '36485.989172823',
            'buyAmountNoSandwich': '0.19717032403522675',
            'address': '0x4A778804a6B568Bd4ae9E93c08107DDb42a5f457',
            'gasPrice': '7.855146533',
            'maxFee': '12.855146533',
            'maxPriority': '2',
            'tag': 'Trader',
            'position': 49,
            'positionNoSandwich': 46,
            'price': '5.299627752958392',
            'priceNoSandwich': '5.404001056440901'},
        {'txHash': '0xe2ee58ff321b26df0460b07fc83200a8702c63d19f9b8a035082ae387533df69',
            'sellToken': 'WETH',
            'sellAmount': '0.1',
            'buyAmount': '18833.30005677',
            'sellAmountNoSandwich': '0.1',
            'buyAmountNoSandwich': '18471.868453555002',
            'address': '0x400B84A83C1475d9c0A0e78e7f5EB8f13D2d9286',
            'gasPrice': '6.767819534',
            'maxFee': '9.081046846',
            'maxPriority': '0.912673001',
            'tag': 'Trader',
            'position': 81,
            'positionNoSandwich': 78,
            'price': '5.309743895045788',
            'priceNoSandwich': '5.4136375132508325'},
        {'txHash': '0x323497270293b2589caea7627280f19b60d8d5f4bb7aa806084e8da84b177347',
            'sellToken': 'WETH',
            'sellAmount': '0.804619515873722368',
            'buyAmount': '139794.348048384',
            'sellAmountNoSandwich': 'N/A',
            'buyAmountNoSandwich': 'N/A',
            'address': 'jaredfromsubway.eth',
            'gasPrice': '88.142731609',
            'maxFee': '88.142731609',
            'maxPriority': '88.142731608',
            'position': 2,
            'tag': 'Backrun',
            'positionNoSandwich': -1,
            'price': '5.7557371031569655',
            'priceNoSandwich': 'N/A'},
        {'txHash': '0x34d400cdc84c75d484ca0ece9af1100f793da373536a4421ae45fe69fef713ce',
            'sellToken': 'TERMINUS',
            'sellAmount': '42367.558150242',
            'buyAmount': '0.236743714441380145',
            'sellAmountNoSandwich': '42367.558150242',
            'buyAmountNoSandwich': '0.224792531878616',
            'address': '0x05615398383D59599E30a8577bf8E23772D0D911',
            'gasPrice': '6.767819534',
            'maxFee': '8.42204312',
            'maxPriority': '0.912673001',
            'position': 1,
            'tag': 'Victim',
            'positionNoSandwich': 79,
            'price': '5.5878536497631',
            'priceNoSandwich': '5.305770303812801'},
        {'txHash': '0x90062cde40c6dbe81732a95b010371fd9ba1981fa241899c7fcdd331cc960e4f',
            'sellToken': 'TERMINUS',
            'sellAmount': '139766.229303296',
            'buyAmount': '0.81618967243784192',
            'sellAmountNoSandwich': 'N/A',
            'buyAmountNoSandwich': 'N/A',
            'address': 'jaredfromsubway.eth',
            'gasPrice': '5.855146533',
            'maxFee': '5.855146533',
            'maxPriority': '0.000000001',
            'position': 0,
            'tag': 'Frontrun',
            'positionNoSandwich': -1,
            'price': '5.839677270441998',
            'priceNoSandwich': 'N/A'}];

    function createDiagram(data, containerId, useSandwich) {
        const container = document.getElementById(containerId);

        let filteredData = useSandwich
            ? data.sort((a, b) => a.position - b.position)
            : data.filter(t => t.tag !== 'Frontrun' && t.tag !== 'Backrun')
                .sort((a, b) => a.positionNoSandwich - b.positionNoSandwich);

        filteredData.forEach(transaction => {
            const block = document.createElement('div');
            block.className = `transaction-block ${transaction.tag}`;

            const number = document.createElement('div');
            number.className = 'transaction-number';
            number.textContent = useSandwich ? transaction.position : transaction.positionNoSandwich;

            const content = document.createElement('div');
            content.className = 'transaction-content';

            const header = document.createElement('div');
            header.className = 'transaction-header';

            const addressTag = document.createElement('span');
            let displayAddress = transaction.address.endsWith('.eth')
                ? transaction.address
                : transaction.address.slice(0, 8) + '...';
            addressTag.innerHTML = `<span class="transaction-address">${displayAddress}</span> <span class="transaction-tag">${transaction.tag}</span>`;

            header.appendChild(addressTag);

            const details = document.createElement('div');
            details.className = 'transaction-details';
            const sellAmount = useSandwich ? transaction.sellAmount : transaction.sellAmountNoSandwich;
            const buyAmount = useSandwich ? transaction.buyAmount : transaction.buyAmountNoSandwich;
            details.innerHTML = `
        Sells ${parseFloat(sellAmount).toFixed(2)} ${transaction.sellToken}<br>
        Buys ${parseFloat(buyAmount).toFixed(2)} ${transaction.sellToken === 'TERMINUS' ? 'WETH' : 'TERMINUS'}
      `;

            content.appendChild(header);
            content.appendChild(details);

            const price = document.createElement('div');
            price.className = 'transaction-price';
            price.textContent = `Price: ${parseFloat(useSandwich ? transaction.price : transaction.priceNoSandwich).toFixed(2)}`;

            const gas = document.createElement('div');
            gas.className = 'transaction-gas';
            gas.innerHTML = `
        Gas Price: ${parseFloat(transaction.gasPrice).toFixed(2)} |
        Max Fee: ${parseFloat(transaction.maxFee).toFixed(2)} |
        Max Priority Fee: ${parseFloat(transaction.maxPriority).toFixed(2)}
      `;

            block.appendChild(number);
            block.appendChild(content);
            block.appendChild(price);
            block.appendChild(gas);

            container.appendChild(block);
        });
    }

    createDiagram(transactionData, 'sandwich-transactions', true);
    createDiagram(transactionData, 'no-sandwich-transactions', false);
});