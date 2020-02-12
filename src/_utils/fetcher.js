import {createApolloFetch} from "apollo-fetch";
import gql from "graphql-tag";
import {config} from './constants'

export const fetcher = createApolloFetch({
    // uri: 'http://192.168.1.21:4000/graphql', //lisa's
    // uri: 'http://192.168.0.39:3333/graphql', //apa's
    // uri: 'http://192.168.137.1:3333/graphql', //
    // uri: 'http://192.168.137.84:3333/graphql', //
    // uri: 'http://192.168.9.104:3333/graphql',
    // uri: 'http://localhost:3333/graphql', //
    uri: config.url.API_URL,
    // uri: contents[0]
});

// console.log('fetcher_url', config);


//     .use(({ request, options }, next) => {
//   options.headers = {
//     authorization: localStorage.getItem('token'),
//   };
//   next();
//   console.log('toooooooooooooooooooooooooken')
// });

export const LOGIN_QUERY = gql`
    mutation loginQuery($email: String!, $password: String!) {
        login(email: $email, password: $password)
    }
`;

export const LOGIN_SEED = gql`
    mutation creator($pass: String!) {
        createDummyUsers(pass: $pass)
    }
`;

// const spaceDelimiter = "&nbsp;";
// const columnDelimiter = "&emsp;";
const lineDelimiter = "<br>";
const typeDelimiter = "-";

export const convertArrayOfObjectsToPrint = (header, array, footer) => {
    array.sort((a, b) => (a.item > b.item ? 1 : -1));  // check this our for sorting

    const itemNameLength = 15;

    let result = header + lineDelimiter + lineDelimiter;
    result +=
        '<table <table style="font-size: 15px; border-collapse: collapse; border:1px solid"><tr style="border:1px solid"><th align="left">Item</th><th>Ty</th><th>Qty</th><th>SubT</th></tr><tbody>';

    for (let i = 0; i < array.length; i++) {
        let start = array[i].item.substr(0, itemNameLength);
        result +=
            `<tr>
                <td style="border:1px solid">${start}</td>
                <td style="border:1px solid">${typeDelimiter}${array[i].type.substring(0, 1)}</td>
                <td style="border:1px solid">${array[i].qty}</td>
                <td style="border:1px solid" align="right">${array[i].subtotal}</td>
        </tr>`;
    }
    result += "</tbody></table>";
    // console.log(result);
    result += footer;

    return result;
};

// ---- Sales.js
export const ENABLED_ITEMS = gql`
    query ItemsQuery {
        getEnabledItems {
            id
            name
            price
            pic
            category {
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
    query ItemsQuery {
        getAllItems {
            id
            name
            price
            pic
            category {
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
    query ItemQuery($id: Int!) {
        getItem(id: $id) {
            id
            name
            price
            pic
            category {
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
    mutation UpdateItem(
        $id: Int!
        $name: String
        $price: Float
        $category_id: Int
        $pic: String
        $has_stock: Boolean
        $quantity: Int
        $available: Boolean
        $status: Status
        $min_stock_level: Int
    ) {
        updateItem(
            id: $id
            name: $name
            price: $price
            pic: $pic
            category_id: $category_id
            has_stock: $has_stock
            quantity: $quantity
            available: $available
            status: $status
            min_stock_level: $min_stock_level
        ) {
            id
            name
            price
            pic
            category {
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

export const ADD_STOCK = gql`
    mutation UpdateStock($id: Int!, $add_to_stock: Int!, $user_id: Int!) {
        updateStock(id: $id, qty_to_add: $add_to_stock, user_id: $user_id)
    }
`;

// Reports.js
export const GET_REPORT = gql`
    query TransactionsQuery(
        $user_id: Int!
        $startDate: String!
        $endDate: String!
        $payment_method: String!
    ) {
        getDailyReport(
            user_id: $user_id
            startDate: $startDate
            endDate: $endDate
            payment_method: $payment_method
        ) {
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

export const GET_MEAL_PLAN_BREAKDOWN = gql`
    query MealPlanBreakdownQuery(
        $user_id: Int!
        $startDate: String!
        $endDate: String!
        $payment_method: String!
    ) {
        mealPlanBreakdown(
            user_id: $user_id
            startDate: $startDate
            endDate: $endDate
            payment_method: $payment_method
        ) {
            user_id
            vendor_id
            item_name
            qty_sold
            item_category
            item_price
            inv
            transaction_point
            student_detail{
                student_id
                name
            }
            createdAt
        }
    }
`;

export const GET_COMPACT_MP_BREAKDOWN = gql`
    query MPSmallBreakdownQuery(
        $user_id: Int!
        $startDate: String!
        $endDate: String!
        $payment_method: String!
    ) {
        mPSmallBreakdown(
            user_id: $user_id
            startDate: $startDate
            endDate: $endDate
            payment_method: $payment_method
        ) {
            user_id
            #            vendor_id
            #            item_name
            qty_sold
            #            item_category
            item_price
            #            inv
            #            transaction_point
            student_detail{
                student_id
                name
            }
            createdAt
        }
    }
`;

export const GET_SHIFT = gql`
    query ShiftQuery(
        $user_id: Int
        $startDate: String!
        $endDate: String!
        $status: String
        $transactionPoint: Int
    ) {
        getShift(
            user_id: $user_id
            startDate: $startDate
            endDate: $endDate
            status: $status
            transactionPoint: $transactionPoint
        ) {
            id
            user {
                first_name
                last_name
            }
            status
            createdAt
            updatedAt
            shift_details {
                id
                item {
                    id
                    name
                    quantity
                    price
                    category {
                        name
                    }
                }
                qty_start
                qty_during_shift
                qty_end
                qty_sold_by_user
                qty_sold_during_shift_time_by_anyone
                mp_reconciliation
                after_mp_reconciliation
                mp_reconciliation_status
                qty_mp_sold_on_cash_pc
                #                user{
                #                    user_id
                #                }
            }
        }
    }
`;

// SalesList.js
export const SAVE_TRANSACTIONS = gql`
    mutation SaveTransaction(
        $item_ids: [Int!]!
        $qtys: [Int!]!
        $payment_method: String!
        $payment_detail: String
        $payment_type: String
        $total_amount: Float!
        $vendor_id: Int!
        $transaction_point_id: Int
        $user_id: Int!
    ) {
        saveTransaction(
            item_ids: $item_ids
            qtys: $qtys
            payment_method: $payment_method
            payment_detail: $payment_detail
            payment_type: $payment_type
            total_amount: $total_amount
            vendor_id: $vendor_id
            transaction_point_id: $transaction_point_id
            user_id: $user_id
        )
    }
`;

//Users.js
export const CREATE_USER = gql`
    mutation CreateUser(
        $first_name: String!
        $last_name: String!
        $other_names: String
        $email: String!
        $password: String
        $status: Status
        $vendor_id: Int!
        $isAdmin: Boolean
        $telephone: String
        $pic: String
        $postal_address: String
    ) {
        createUser(
            first_name: $first_name
            last_name: $last_name
            other_names: $other_names
            email: $email
            password: $password
            status: $status
            vendor_id: $vendor_id
            isAdmin: $isAdmin
            telephone: $telephone
            pic: $pic
            postal_address: $postal_address
        ) {
            user_id
            first_name
            last_name
            email {
                email
            }
        }
    }
`;

export const CHANGE_PASSWORD = gql`
    mutation ChangePassword(
        $user_id: Int!
        $old: String!
        $newP: String!
        $conf: String!
    ) {
        changePassword(user_id: $user_id, old: $old, newP: $newP, conf: $conf)
    }
`;

export const VALID_PASSWORD = gql`
    mutation ValidPass($id: Int!, $pass: String!) {
        validPass(id: $id, pass: $pass)
    }
`;

export const ADMIN_RESET_PASSWORD = gql`
    mutation ResetPasswordAdmin($user_id: Int!) {
        resetPasswordAdmin(user_id: $user_id)
    }
`;

export const USER_UPDATE = gql`
    mutation UpdateUser(
        $first_name: String!
        $last_name: String!
        $other_names: String
        $status: Status
        $vendor_id: Int!
        $isAdmin: Boolean
        $telephone: String
        $pic: String
        $postal_address: String
        $user_id: Int!
    ) {
        updateUser(
            first_name: $first_name
            last_name: $last_name
            other_names: $other_names
            status: $status
            vendor_id: $vendor_id
            user_id: $user_id
            isAdmin: $isAdmin
            telephone: $telephone
            pic: $pic
            postal_address: $postal_address
        )
    }
`;

export const LOGGED_USER = gql`
    query UserQuery {
        me {
            user_id
            first_name
            last_name
            isAdmin
            pic
        }
    }
`;

export const USERS = gql`
    query UsersQuery {
        allUsersNoAdmin {
            user_id
            first_name
            last_name
            email {
                email
            }
        }
    }
`;

export const GET_STUDENT_DETAIL = gql`
    query StudentDetailQuery($student_id: String!) {
        getStudentDetail(student_id: $student_id) {
            student_id
            name
        }
    }
`;

export const ALL_USERS = gql`
    query UsersQuery {
        allUsersNoAdminDis {
            user_id
            first_name
            last_name
            other_names
            telephone
            pic
            status
            email {
                email
            }
            postal_address
            vendor {
                name
                email
                telephone
                postal_address
                website_url
            }
            isAdmin
            createdAt
            updatedAt
        }
    }
`;

export const GET_CATEGORIES = gql`
    query ItemCategoryQuery {
        getItemCategories {
            id
            name
            status
            createdAt
            updatedAt
        }
    }
`;

export const CATEGORY_ADD = gql`
    mutation CreateItemCategory(
        $name: String!
        $status: Status
        $vendor_id: Int
    ) {
        createItemCategory(
            name: $name
            status: $status
            vendor_id: $vendor_id
        )
    }
`;

export const ITEM_CATEGORY_UPDATE = gql`
    mutation UpdateItemCategory(
        $id: Int!
        $name: String!
        $status: Status
        $vendor_id: Int
    ) {
        updateItemCategory(
            id: $id
            name: $name
            status: $status
            vendor_id: $vendor_id
        )
    }
`;

export const CHECK_FOR_ANY_ACTIVE_SHIFT = gql`
    query CheckAnyShiftQuery {
        isOneShiftActive {
            id
            user {
                first_name
                last_name
            }
        }
    }
`;

export const CHECK_USER_SESSION = gql`
    query CheckShiftStartedQuery($user_id: Int!) {
        userShiftStarted(user_id: $user_id)
    }
`;

export const START_SHIFT = gql`
    mutation CreateShiftQuery($user_id: Int!) {
        createShift(user_id: $user_id)
    }
`;

export const END_SHIFT = gql`
    mutation EndShiftQuery($user_id: Int!) {
        endShift(user_id: $user_id)
    }
`;

// export const MP_RECONCILIATION_2 = gql`
//     mutation MPReconciliationQuery($shift_detail:[ShiftDetail!]!)
//     {
//         mpReconciliation(shift_detail: $shift_detail)
//     }
// `;

export const MP_RECONCILIATION = gql`
    mutation MPReconciliationQuery($shift_detail_ids:[Int!]!, $mp_qtys_sold:[Int]!, $mp_qtys_left:[Int]!, $mp_rec_status:[String]!, $mp_item_ids:[Int!]!, $shift_ids:[Int!]!)
    {
        mpReconciliation(shift_detail_ids: $shift_detail_ids, mp_qtys_sold:$mp_qtys_sold, mp_qtys_left:$mp_qtys_left, mp_rec_status:$mp_rec_status, mp_item_ids: $mp_item_ids, shift_ids: $shift_ids)
    }
`;

// methods

export const getUser = token => {
    // console.log('tokenpppppppppppppppppppppppppppppppppppppppppp', token);
    fetcher.use(({request, options}, next) => {
        options.headers = {
            authorization: token,
        };
        next();
    });
    return fetcher({
        query: LOGGED_USER,
    }).then(r => r.data.me);
    // console.log(u)
    // return u
};

export const isAnyShiftActive = async () => {
    try {
        let a = await fetcher({
            query: CHECK_FOR_ANY_ACTIVE_SHIFT,
            // variables: {user_id: user_id}
        });
        // console.log(a);
        if (!a) return null;
        return a.data.isOneShiftActive;
    } catch (e) {
        console.log(e);
    }
};