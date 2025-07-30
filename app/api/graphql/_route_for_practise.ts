import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { NextRequest } from "next/server";

let employees = [
  {
    id: 1,
    name: "John Doe",
    position: "Software Engineer",
    department: "Engineering",
    salary: 75000,
    email: "john.doe@company.com",
  },
  {
    id: 2,
    name: "Jane Smith",
    position: "Product Manager",
    department: "Product",
    salary: 85000,
    email: "jane.smith@company.com",
  },
  {
    id: 3,
    name: "Mike Johnson",
    position: "Designer",
    department: "Design",
    salary: 70000,
    email: "mike.johnson@company.com",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    position: "Data Analyst",
    department: "Analytics",
    salary: 68000,
    email: "sarah.wilson@company.com",
  },
];

const typeDefs = `#graphql

    type Employee {
      id:ID!
      name:String!
      position:String!
      department:String!
      salary:Int!
      email:String!
    }



    interface LivingBeing {
        name:String!
        age:Int!
    }

    type Person implements LivingBeing {
        name:String!
        age:Int!
        LivingBeingPlantPerson:String!
        }
        type Alien implements LivingBeing{
            name:String!
            age:Int!
            LivingBeingPlantAlien:String!
        }

#query {
 # LivingBeing {
   # ... on Person {
  #    name
 #     age
 #     LivingBeingPlantPerson
  #  }
  #  ... on Alien {
   #   LivingBeingPlantAlien
 #   }
 # }
#}
        type SreachForVedio{
            vName:String
        }
        type seachForTweet{
            actionKeyword:String
        }

       union   SeachAnything  = SreachForVedio | seachForTweet

        input inputId{
          id:Int!
        }

        input addEmoloyeInput{
          name:String!
          position:String!
          department:String!
          salary:Int!
          email:String!
        }

        input updateEmployeName{
          id:Int!
          name:String!
        }

        enum EYES_COLOR{
          BLACK,
          BROWN
        }
        type Her{
          eyes:String!
          hairs:String!
          eyesColor:EYES_COLOR
        }

        type Machine {
          name:String!
          isOperatable:String!
        }

        type Computer{
          name:String!
          specs:String!
        }

        union CombinationOfBoth = Machine | Computer


        # suppose we have a qurey that servers Criminals With Record of the people they kill eg
        type DeadPeople{
          name:String!
          age:Int!
        }
        
        type Criminal{
          name:String!
          kills:[DeadPeople]!

        }

    type Query {
        # no imaging qurey you have to specify that you want kills ohterwise a big fat error is coming to you
        # to solve this use nested object resolver get kills when they ask to avoid unnessacary joins
        Criminal:[Criminal]! 

          CombinationOfBoth:[CombinationOfBoth!]!
          Her:Her!
         hello: String
        # SeachAnything:[SeachAnything]
        # LivingBeing:[LivingBeing]
        employe:[Employee!]!
        findEmploye(input:inputId!):[Employee!]!
        deleteEmploye(input:inputId!):[Employee!]!
       
        
    }

    type Mutation {
      addEmoloye(input:addEmoloyeInput):[Employee!]!
      updateEmployeName(input:updateEmployeName):[Employee!]!
    }
`;

const resolvers = {
  CombinationOfBoth: {
    __resolveType(obj: { isOperatable?: string; specs?: string }) {
      if (obj.isOperatable) {
        return "Machine";
      }
      if (obj.specs) return "Computer";
    },
  },

  // TODO:
  // resolving enums
  // EYES_COLOR: {
  //   BLACK: "#000F",
  //   BROWN: "#00DE", // supose this is brown LOL
  // },

  // resolving specific feild and ENUM CREATED ABOVE
  Her: {
    hairs: (parent: { hairs: string }) => {
      return parent.hairs.toLocaleUpperCase();
    },
    // eyesColor: (parent: { eyesColor: string }) => {
    //   console.log(parent);
    //   return parent.eyesColor;
    // },
  },
  Criminal: {
    kills: (parent: {
      name: string;
      kills: [{ name: string; age: number }];
    }) => {
      // so this solves problem
      // console.log(parent.kills[0].name);
      // fidning paranet.name who kills people
      return [
        { name: "hesingBier", age: 20 },
        { name: "bangBites ", age: 25 },
      ];
    },
  },

  Query: {
    CombinationOfBoth: () => {
      return [
        {
          name: "name ",
          isOperatable: "yes",
        },
        {
          name: "computer",
          specs: "i5 gen2nd Octa Core Os-not defined",
        },
      ];
    },
    Criminal: () => {
      // i am asking for name only and you still will be asking for joins and qureying db so instead use object resolver
      // use join when they are needed
      return [
        // instead of return kills as well when it is not required well still gonna qurey so instead we
        // make a nested reoslver and returns when asked that simple
        {
          name: "jack",
        },
      ];
    },
    Her: () => {
      return {
        eyes: "👀👀",
        hairs: "damnGodBeutiful",
        eyesColor: "BLACK", // Return the enum value, not an array
      };
    },
    hello: (_parent: unknown, _args: unknown, ctx: { user: string }) =>
      `hello${ctx.user}`,
    employe: () => {
      return employees.map((emp) => emp);
    },
    findEmploye: (_parent: unknown, args: { input: { id: number } }) => {
      console.log(args.input);
      const doesEmpolyeeExists = employees.find(
        (employe) => employe.id == args.input.id
      );
      console.log(doesEmpolyeeExists);
      return doesEmpolyeeExists ? [doesEmpolyeeExists] : [];
    },
    deleteEmploye: (_parent: unknown, args: { input: { id: number } }) => {
      console.log(args);
      const deletedEmploye = employees.find((emp) => emp.id == args.input.id);
      console.log(deletedEmploye);
      employees = employees.filter((emp) => emp.id !== args.input.id);
      console.log("after deleting", args.input.id);
      console.log(employees);
      if (!deletedEmploye) return [];
      return [deletedEmploye];
    },
  },
  Mutation: {
    addEmoloye: (
      _parent: unknown,
      args: {
        input: {
          name: string;
          position: string;
          department: string;
          salary: number;
          email: string;
        };
      }
    ) => {
      // Get the next ID by finding the maximum ID and adding 1
      const id = Math.max(...employees.map((emp) => emp.id)) + 1;
      console.log(args);
      const { name, position, department, salary, email } = args.input;
      // Create new employee
      const newEmployee = { id, name, position, department, salary, email };
      employees.push(newEmployee);
      return [newEmployee];
    },

    updateEmployeName: (
      _parent: unknown,
      args: { input: { id: number; name: string } }
    ) => {
      console.log(args);
      // find that employyeeeeeeeee
      const thatEmployee = employees.find((emp) =>
        emp.id == args.input.id ? (emp.name = args.input.name) : ""
      );
      if (!thatEmployee) {
        return [];
      }
      // lets update that
      return [thatEmployee];
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});
// @ignore-ts
const handler = startServerAndCreateNextHandler(server, {
  context: async function jack() {
    return {
      user: "jack",
    };
  },
});

// export { handler as GET, handler as POST };
// or we can do like below

export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}
