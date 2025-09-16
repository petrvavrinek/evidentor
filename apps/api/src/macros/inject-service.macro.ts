
import Elysia from "elysia";
import Container, { type Constructable } from "typedi";



export const injectService = <TName extends string, T extends any>(name: TName, type: Constructable<T>) => {
  console.log("WTF");
  return new Elysia()
  .decorate(name, Container.get<T>(type));

}
