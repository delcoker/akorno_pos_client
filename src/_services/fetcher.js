import {createApolloFetch} from "apollo-fetch";
import gql from "graphql-tag";

export const fetcher = createApolloFetch({
    uri: 'http://192.168.1.21:4000/graphql', //lisa's
    // uri: 'http://192.168.0.39:4000/graphql', //apa's
    // uri: 'http://localhost:4000/graphql',
});

export const LOGIN_QUERY = gql`
    mutation loginQuery($email:String!, $password: String!){
        login(email:$email, password: $password)
    }
`;

export const LOGIN_SEED = gql`
    mutation creator($pass: String!){
        createDummyUsers(pass:$pass)
    }
`;

// const spaceDelimiter = "&nbsp;";
// const columnDelimiter = "&emsp;";
const lineDelimiter = "<br>";
const typeDelimiter = "-";

export const convertArrayOfObjectsToPrint = (header, array, footer) => {
    array.sort((a, b) => (a.item > b.item ? 1 : -1));

    const itemNameLength = 15;

    let result = header + lineDelimiter + lineDelimiter;
    result +=
        '<table border="1px"><tr><th align="left">Item</th><th>Ty</th><th>Qty</th><th>SubT</th></tr>';

    for (let i = 0; i < array.length; i++) {
        let start = array[i].item.substr(0, itemNameLength);
        result += "<tbody><tr><td>" + start + /*spaceDelimiter.repeat(10 - start.substr(0, itemNameLength).length) +*/ "</td><td>" +
            typeDelimiter + array[i].type.substring(0, 1) + "</td><td>" + array[i].qty + '</td><td align="right">' + array[i].subtotal + "</td></tr></tbody>";
    }
    result += "</table>";
    // console.log(result);
    result += footer;

    return result;
};

// ---- Sales.js
export const ENABLED_ITEMS = gql`
    query ItemsQuery{
        getEnabledItems{
            id
            name
            price
            pic
            category{
                id
                name
            }
            has_stock
            quantity
        }
    }
`;

// Items.js
export const ALL_ITEMS = gql`
    query ItemsQuery{
        getAllItems{
            id
            name
            price
            pic
            category{
                id
                name
            }
            min_stock_level
            has_stock
            quantity
            status
            createdAt
            updatedAt
        }
    }
`;

export const GET_ITEM = gql`
    query ItemQuery($id:Int!){
        getItem(id:$id){
            id
            name
            price
            pic
            category{
                id
                name
            }
            min_stock_level
            has_stock
            quantity
            status
            createdAt
            updatedAt
        }
    }
`;

export const ITEM_UPDATE = gql`
    mutation UpdateItem($id: Int!, $name: String, $price: Float,
        $category_id: Int, $pic: String, $has_stock:Boolean,
        $quantity: Int, $available:Boolean, $status: Status,
        $min_stock_level: Int){
        updateItem(
            id:$id, name:$name, price:$price, pic: $pic,
            category_id:$category_id, has_stock:$has_stock
            quantity: $quantity, available:$available, status: $status,
            min_stock_level: $min_stock_level)
    }
`;

export const ADD_STOCK = gql`
    mutation UpdateStock($id: Int!, $add_to_stock:Int!, $user_id:Int!){
        updateStock(
            id:$id, qty_to_add:$add_to_stock, user_id:$user_id)
    }
`;

// Reports.js
export const GET_REPORT = gql`
    query TransactionsQuery($user_id: Int!, $startDate: String, $endDate: String){
        getDailyReport(user_id: $user_id, startDate: $startDate, endDate: $endDate){
            user_id
            vendor_id
            item_name
            qty_sold
            item_category
            item_price
            inv
            transaction_point
        }
    }
`;

// SalesList.js
export const SAVE_TRANSACTIONS = gql`
    mutation SaveTransaction($item_ids: [Int!]!, $qtys: [Int!]!, $payment_method: String,
        $payment_detail: String, $payment_type: String, $total_amount:Float!,
        $vendor_id: Int!, $transaction_point_id:Int, $user_id: Int!){
        saveTransaction(
            item_ids: $item_ids, qtys: $qtys, payment_method: $payment_method,
            payment_detail: $payment_detail, payment_type: $payment_type, total_amount:$total_amount,
            vendor_id: $vendor_id, transaction_point_id:$transaction_point_id, user_id: $user_id)
    }
`;

export const LOGGED_USER = gql`
    query UserQuery{
        me{
            user_id
            first_name
            last_name
        }
    }
`;

export const USERS = gql`
    query UsersQuery{
        allUsersNoAdmin{
            user_id
            first_name
            last_name
            email{
                email
            }
        }
    }
`;

export const getUser = (token) => {
    // console.log('tokenpppppppppppppppppppppppppppppppppppppppppp', token);
    fetcher.use(({request, options}, next) => {
        options.headers = {
            "authorization": token
        };
        next();
    });
    return fetcher({
        query: LOGGED_USER,
    }).then(r => r.data.me);
    // console.log(u)
    // return u
};

export const CATEGORIES = gql`
    query ItemCategoryQuery{
        getItemCategories{
            id
            name
            status
        }
    }
`;
