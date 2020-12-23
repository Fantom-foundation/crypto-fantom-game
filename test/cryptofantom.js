const { expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const Game = artifacts.require("CryptoFantom.sol");
const FakeBadRecipient = artifacts.require("FakeBadRecipient.sol");

contract("Game", (accounts) => {
  let token;
  const [admin, trader1] = [accounts[0], accounts[1], accounts[2]];

  beforeEach(async () => {
    token = await Game.new("Uri");
    for (let i = 0; i < 3; i++) {
      await token.mint();
    }
  });

  it("should NOT mint if not admin", async () => {
    await expectRevert(token.mint({ from: trader1 }), "only admin");
  });

  it("should mint if admin", async () => {
    const balanceBefore = await token.balanceOf(admin);
    const receipt = await token.mint({ from: admin });
    await token.mint({ from: admin });
    const balanceAfter = await token.balanceOf(admin);
    const owner = await token.ownerOf(4);
    assert(balanceAfter.sub(balanceBefore).toNumber() === 2);
    assert(owner === admin);
    expectEvent(receipt, "Transfer", {
      _from: "0x0000000000000000000000000000000000000000",
      _to: admin,
      _tokenId: web3.utils.toBN(3),
    });
  });

  it("should NOT transfer if balance is 0", async () => {
    await expectRevert(
      token.transferFrom(accounts[4], accounts[4], 0, { from: accounts[4] }),
      "Transfer not authorized"
    );
    await expectRevert(
      token.safeTransferFrom(accounts[4], accounts[4], 0, {
        from: accounts[4],
      }),
      "Transfer not authorized"
    );
  });

  it("should NOT transfer if not owner", async () => {
    await expectRevert(
      token.transferFrom(admin, trader1, 0, { from: trader1 }),
      "Transfer not authorized"
    );
    await expectRevert(
      token.safeTransferFrom(admin, trader1, 0, { from: trader1 }),
      "Transfer not authorized"
    );
  });

  // the reason for the error is `revert` and not the error we want
  it("safeTransferFrom() should NOT transfer if recipient contract does not implement erc721recipient interface", async () => {
    const badRecipient = await FakeBadRecipient.new();
    await expectRevert(
      token.safeTransferFrom(admin, badRecipient.address, 0, { from: admin }),
      "revert"
    );
  });

  it("transferFrom() should transfer", async () => {
    const tokenId = 0;
    const receipt = await token.transferFrom(admin, trader1, tokenId, {
      from: admin,
    });
    const [balanceAdmin, balanceTrader, owner] = await Promise.all([
      token.balanceOf(admin),
      token.balanceOf(trader1),
      token.ownerOf(tokenId),
    ]);
    assert(balanceAdmin.toNumber() === 2);
    assert(balanceTrader.toNumber() === 1);
    assert(owner === trader1);
    expectEvent(receipt, "Transfer", {
      _from: admin,
      _to: trader1,
      _tokenId: web3.utils.toBN(tokenId),
    });
  });

  it("transferFrom() should transfer", async () => {
    const tokenId = 0;
    const receipt = await token.transferFrom(admin, trader1, tokenId, {
      from: admin,
    });
    const [balanceAdmin, balanceTrader, owner] = await Promise.all([
      token.balanceOf(admin),
      token.balanceOf(trader1),
      token.ownerOf(tokenId),
    ]);
    assert(balanceAdmin.toNumber() === 2);
    assert(balanceTrader.toNumber() === 1);
    assert(owner === trader1);
    expectEvent(receipt, "Transfer", {
      _from: admin,
      _to: trader1,
      _tokenId: web3.utils.toBN(tokenId),
    });
  });

  it("safeTransferFrom() should transfer", async () => {
    const tokenId = 0;
    const receipt = await token.safeTransferFrom(admin, trader1, tokenId, {
      from: admin,
    });
    const [balanceAdmin, balanceTrader, owner] = await Promise.all([
      token.balanceOf(admin),
      token.balanceOf(trader1),
      token.ownerOf(tokenId),
    ]);
    assert(balanceAdmin.toNumber() === 2);
    assert(balanceTrader.toNumber() === 1);
    assert(owner === trader1);
    expectEvent(receipt, "Transfer", {
      _from: admin,
      _to: trader1,
      _tokenId: web3.utils.toBN(tokenId),
    });
  });

  it("should transfer token when approved", async () => {
    const tokenId = 0;
    const receipt1 = await token.approve(trader1, tokenId);
    await token.getApproved(tokenId);
    const receipt2 = await token.transferFrom(admin, trader1, tokenId, {
      from: trader1,
    });
    const [balanceAdmin, balanceTrader, owner] = await Promise.all([
      token.balanceOf(admin),
      token.balanceOf(trader1),
      token.ownerOf(tokenId),
    ]);
    assert(balanceAdmin.toNumber() === 2);
    assert(balanceTrader.toNumber() === 1);
    assert(owner === trader1);
    expectEvent(receipt2, "Transfer", {
      _from: admin,
      _to: trader1,
      _tokenId: web3.utils.toBN(tokenId),
    });
    expectEvent(receipt1, "Approval", {
      _owner: admin,
      _approved: trader1,
      _tokenId: web3.utils.toBN(tokenId),
    });
  });

  it("should transfer token when approved", async () => {
    const tokenId = 0;
    const receipt1 = await token.setApprovalForAll(trader1, true);

    const isApprovedForAll = await token.isApprovedForAll(admin, trader1);
    assert(isApprovedForAll === true);
    const receipt = await token.transferFrom(admin, trader1, tokenId, {
      from: trader1,
    });
  });
});

contract("Game", (accounts) => {
  let game;
  const [admin, player1] = [accounts[0], accounts[1]];

  beforeEach(async () => {
    game = await Game.new("https://url-to-your-game-server");
    for (let i = 0; i < 3; i++) {
      await game.mint();
    }
  });

  it("should NOT mint if not admin", async () => {
    await expectRevert(game.mint({ from: player1 }), "only admin");
  });

  it("should mint if admin", async () => {
    await game.mint();
    await game.mint();

    const owner1 = await game.ownerOf(0);
    const owner2 = await game.ownerOf(1);
    assert(owner1 === admin);
    assert(owner2 === admin);

    const nextId = await game.nextId.call();
    assert(nextId.toNumber() === 5);

    const fantom1 = await game.fantoms(0);
    assert(fantom1.id.toNumber() === 0);
    assert(fantom1.generation.toNumber() === 1);

    const fantom2 = await game.fantoms.call(1);
    assert(fantom2.id.toNumber() === 1);
    assert(fantom2.generation.toNumber() === 1);
  });

  it("should breed", async () => {
    await game.mint();
    await game.mint();
    await game.breed(0, 1);

    const nextId = await game.nextId();
    assert(nextId.toNumber() === 6);

    const fantom3 = await game.fantoms(2);
    assert(fantom3.id.toNumber() === 2);
    assert(fantom3.generation.toNumber() === 1);

    const owner3 = await game.ownerOf(2);
    assert(owner3 === admin);
  });
});
