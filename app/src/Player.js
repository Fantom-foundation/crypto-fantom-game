import React from "react";
import { drizzleReactHooks } from "@drizzle/react-plugin";
import { newContextComponents } from "@drizzle/react-components";
import FantomList from './FantomList';

const { useDrizzle, useDrizzleState } = drizzleReactHooks;
const { ContractForm, ContractData } = newContextComponents;

export default () => {
  const { drizzle } = useDrizzle();
  const state = useDrizzleState(state => state);

  return (
    <div>
      <div>
        <h2>Breed</h2>
        <ContractForm
          drizzle={drizzle}
          contract="CryptoFantom"
          method="breed"
        />
      </div>
      <div>
        <h2>Player Fantoms</h2>
        <ContractData
          drizzle={drizzle}
          drizzleState={state}
          contract="CryptoFantom"
          method="tokenURIBase"
          render={uriBase => {
            return (
              <ContractData
                drizzle={drizzle}
                drizzleState={state}
                contract="CryptoFantom"
                method="getAllFantomsOf"
                methodArgs={[state.accounts[0]]}
                render={fantoms => (
                  <FantomList
                    fantoms={fantoms}
                    uriBase={uriBase}
                  />
                )}
              />
            );
          }}
        />
      </div>
    </div>
  );
};
