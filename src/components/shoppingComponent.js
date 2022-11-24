import React, { Component } from "react";
import {
  TextField,
  Paper,
  Grid,
  Button,
  MenuList,
  MenuItem,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  ButtonGroup,
  Badge,
} from "@mui/material";
import shoppingList from "./items.json";
import "scrollable-component";

class ShoppingComp extends Component {
  state = {
    //states for data
    shoppingList: [],
    categories: [],
    filteredShoppingList: [],
    cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
    lowToHigh: false,

    //state of search/filter value
    searchVal: "",
    filterValue: "All Items",
    sortValue: "",

    //modal state
    isCheckoutOpen: false,
  };

  componentDidMount() {
    this.initData();
  }

  initData() {
    let data = shoppingList.map((i) => {
      return {
        id: i.id,
        productName: i.productName,
        description: i.description,
        unitPrice: i.unitPrice,
        imageUrl: i.imageUrl,
        category: i.category,
        cartQty: 0,
      };
    });

    this.setState(
      {
        shoppingList: data,
        filteredShoppingList: data,
      },
      () => {
        this.handleGetCategoryFilters();
      }
    );
  }

  handleGetCategoryFilters() {
    let categories = this.state.filteredShoppingList.map((i) => i.category);
    let uniqueCat = [...new Set(categories)];
    this.setState({ categories: uniqueCat });
  }

  //Case Sensitive Searching
  handleSearch(value) {
    this.setState({ searchVal: value }, () => {
      const filtered = this.state.shoppingList.filter((entry) =>
        Object.values(entry).some(
          (val) => typeof val === "string" && val.includes(this.state.searchVal)
        )
      );

      this.setState({ filteredShoppingList: filtered });
    });
  }

  handleFilter(item) {
    if (item === "All Items") {
      this.setState({
        filteredShoppingList: this.state.shoppingList,
        filterValue: item,
      });
    } else {
      let filteredList = this.state.shoppingList.filter(
        (i) => i.category === item
      );
      this.setState({ filteredShoppingList: filteredList, filterValue: item });
    }
  }

  handleAddToCart(item, key) {
    let cartItems = [];
    if (this.handleCheck(item) === false) {
      cartItems.push(item);
      let index = cartItems.findIndex((obj) => obj.id === item.id);
      if (index >= 0) {
        cartItems[index].cartQty = cartItems[index].cartQty + 1;
      }
      this.setState(
        (prevState) => ({
          cartItems: [...prevState.cartItems, item],
        }),
        () => {
          localStorage.setItem(
            "cartItems",
            JSON.stringify(this.state.cartItems)
          );
        }
      );
    } else {
      let index = cartItems.findIndex((obj) => obj.id === item.id);
      if (index >= 0) {
        cartItems[index].cartQty = cartItems[index].cartQty + 1;
      }
      this.setState({ cartItems }, () => {
        localStorage.setItem("cartItems", JSON.stringify(this.state.cartItems));
      });
    }
  }

  handleToggle(item, key, value) {
    let index = this.state.cartItems.findIndex((obj) => obj.id === item.id);
    if (index === key && value === "+") {
      this.state.cartItems[index].cartQty =
        this.state.cartItems[index].cartQty + 1;

      this.setState({ cartItems: this.state.cartItems }, () => {
        localStorage.setItem("cartItems", JSON.stringify(this.state.cartItems));
      });
    } else {
      this.state.cartItems[index].cartQty =
        this.state.cartItems[index].cartQty - 1;

      this.setState({ cartItems: this.state.cartItems }, () => {
        localStorage.setItem("cartItems", JSON.stringify(this.state.cartItems));
      });
    }
  }
  handleCheck(val) {
    return this.state.cartItems.some((item) => val.id === item.id);
  }

  handleCheckout() {
    this.setState({ isCheckoutOpen: true }, () => {
      setTimeout(() => {
        this.setState(
          { isCheckoutOpen: false, cartItems: [], filterValue: "All Items" },
          () => {
            localStorage.setItem(
              "cartItems",
              JSON.stringify(this.state.cartItems)
            );
            this.initData();
          }
        );
      }, 5000);
    });
  }

  handleSort(sortValue) {
    if (sortValue === "" || sortValue === "desc") {
      let numAscending = [...this.state.filteredShoppingList].sort(
        (a, b) => a.unitPrice - b.unitPrice
      );
      this.setState({ filteredShoppingList: numAscending, sortValue: "asc" });
    } else if (sortValue === "asc") {
      const numDescending = [...this.state.filteredShoppingList].sort(
        (a, b) => b.unitPrice - a.unitPrice
      );
      this.setState({ filteredShoppingList: numDescending, sortValue: "desc" });
    }
  }

  handleRemove(item, key) {
    console.log(item, key);
    let data = this.state.cartItems.filter((el) => el !== item);
    this.setState({ cartItems: data });
  }

  render() {
    const totalCart = this.state.cartItems.reduce((accumulator, object) => {
      return accumulator + object.cartQty;
    }, 0);

    let amount = 0;
    let totalAmount = 0;
    for (let index = 0; index < this.state.cartItems.length; index++) {
      const element = this.state.cartItems[index];
      amount = element.cartQty * element.unitPrice;
      totalAmount += amount;
    }

    return (
      <React.Fragment>
        <Dialog
          open={this.state.isCheckoutOpen}
          style={{ textAlign: "center" }}
        >
          <DialogTitle style={{ marginTop: 20 }}>
            Purchase Successful
          </DialogTitle>
          <DialogContent
            style={{ marginLeft: 50, marginRight: 50, marginBottom: 20 }}
          >
            Items have been purchased successfully!
          </DialogContent>
        </Dialog>
        <div>
          <Grid container spacing={0}>
            <Grid xs style={{ paddingTop: 50 }}>
              <MenuList style={{ position: "fixed", width: 316 }}>
                <MenuItem
                  onClick={() => this.handleFilter("All Items")}
                  style={{
                    backgroundColor:
                      this.state.filterValue === "All Items" ? "#8feb34" : "",
                  }}
                >
                  <ListItemText>All Items</ListItemText>
                </MenuItem>
                {this.state.categories.map((i) => {
                  return (
                    <div>
                      <MenuItem
                        onClick={() => this.handleFilter(i)}
                        style={{
                          backgroundColor:
                            this.state.filterValue === i ? "#8feb34" : "",
                        }}
                      >
                        <ListItemText>
                          {i.charAt(0).toUpperCase() + i.slice(1)}
                        </ListItemText>
                      </MenuItem>
                    </div>
                  );
                })}
              </MenuList>
            </Grid>
            <Divider orientation="vertical" flexItem />
            <Grid xs={8}>
              <div style={{ textAlign: "center" }}>
                <TextField
                  style={{ width: 1000, marginTop: 100 }}
                  id="outlined-basic"
                  variant="outlined"
                  size="small"
                  value={this.state.searchVal}
                  placeholder={"Search Item"}
                  onChange={(e) => this.handleSearch(e.target.value)}
                />
              </div>
              <div style={{ float: "right", marginTop: 20, marginRight: 200 }}>
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    this.handleSort(this.state.sortValue);
                  }}
                >
                  {this.state.sortValue === "asc"
                    ? "Sort price high to low"
                    : "Sort price low to high"}
                </span>
              </div>
              {this.state.filteredShoppingList.map((i, key) => {
                return (
                  <div style={{ width: 1000, margin: "auto", marginTop: 50 }}>
                    <Paper key={i.id}>
                      <Grid container spacing={0}>
                        <Grid xs>
                          <div style={{ textAlign: "center" }}>
                            <img
                              src={i.imageUrl}
                              alt={i.productName}
                              style={{
                                height: 120,
                                width: 120,
                                marginTop: 50,
                                marginBottom: 50,
                              }}
                            />
                          </div>
                        </Grid>
                        <Grid xs={6}>
                          <div
                            style={{
                              fontSize: 18,
                              fontWeight: "bold",
                              marginBottom: 5,
                              marginTop: 5,
                            }}
                          >
                            {i.productName}
                          </div>
                          <div
                            style={{
                              color: "green",
                              fontSize: 14,
                              marginBottom: 5,
                            }}
                          >
                            {i.category.charAt(0).toUpperCase() +
                              i.category.slice(1)}
                          </div>
                          <div style={{ fontSize: 18, color: "gray" }}>
                            {i.description}
                          </div>
                        </Grid>
                        <Grid xs>
                          <div
                            style={{
                              textAlignLast: "end",
                              marginRight: 40,
                              marginTop: 28,
                            }}
                          >
                            <div
                              style={{
                                fontSize: 25,
                                fontWeight: "bold",
                                marginBottom: 5,
                                color: "red",
                              }}
                            >
                              &#8369;{i.unitPrice}
                            </div>
                            <div style={{ marginBottom: 5 }}>
                              <Button
                                disabled={
                                  this.handleCheck(i) === true ? true : false
                                }
                                key={i.id}
                                style={{
                                  textTransform: "none",
                                  background:
                                    this.handleCheck(i) === true
                                      ? "gray"
                                      : "#8feb34",
                                  color: "black",
                                  marginTop: 30,
                                }}
                                onClick={() => this.handleAddToCart(i, key)}
                              >
                                Add to Cart
                              </Button>
                            </div>
                          </div>
                        </Grid>
                      </Grid>
                    </Paper>
                  </div>
                );
              })}
            </Grid>
            <Divider orientation="vertical" flexItem />
            <Grid xs style={{ paddingTop: 50 }}>
              <div style={{ position: "fixed", width: 316 }}>
                <div style={{ height: 100, backgroundColor: "lightgray" }}>
                  <Grid container spacing={0}>
                    <Grid xs>
                      <div
                        style={{
                          marginTop: 30,
                          textAlign: "center",
                          fontSize: 24,
                          fontWeight: "bold",
                        }}
                      >
                        My Cart
                      </div>
                    </Grid>
                    <Grid xs>
                      <div style={{ float: "right" }}>
                        <Button
                          style={{
                            textTransform: "none",
                            background: "red",
                            color: "white",
                            marginTop: 50,
                            marginRight: 15,
                            height: 30,
                          }}
                          onClick={() =>
                            this.setState({ cartItems: [] }, () => {
                              localStorage.setItem(
                                "cartItems",
                                JSON.stringify(this.state.cartItems)
                              );
                              this.initData();
                            })
                          }
                        >
                          Clear cart
                        </Button>
                      </div>
                    </Grid>
                  </Grid>
                </div>
                <div style={{ height: 650 }}>
                  <scrollable-component style={{ height: 630 }}>
                    {this.state.cartItems.map((i, key) => {
                      return (
                        <React.Fragment>
                          <div>
                            <Grid container spacing={0}>
                              <Grid itemx xs={3}>
                                <div style={{ textAlign: "center" }}>
                                  <Badge
                                    color="secondary"
                                    overlap="circular"
                                    badgeContent="X"
                                    anchorOrigin={{
                                      vertical: "top",
                                      horizontal: "left",
                                    }}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => this.handleRemove(i, key)}
                                  >
                                    <img
                                      src={i.imageUrl}
                                      alt={i.productName}
                                      style={{
                                        height: 50,
                                        width: 50,
                                        marginTop: 50,
                                        marginBottom: 50,
                                      }}
                                    />
                                  </Badge>
                                </div>
                              </Grid>
                              <Grid itemx xs={4}>
                                <div
                                  style={{ textAlign: "left", marginTop: 40 }}
                                >
                                  <div>
                                    <div
                                      style={{
                                        fontSize: 15,
                                        fontWeight: "bold",
                                        marginBottom: 5,
                                        marginTop: 5,
                                      }}
                                    >
                                      {i.productName}
                                    </div>
                                    <div
                                      style={{
                                        fontSize: 15,
                                        fontWeight: "bold",
                                        marginBottom: 5,
                                        color: "red",
                                      }}
                                    >
                                      &#8369;
                                      {(i.unitPrice * i.cartQty).toFixed(2)}
                                    </div>
                                  </div>
                                </div>
                              </Grid>
                              <Grid itemx xs={5}>
                                <div style={{ marginTop: 50 }}>
                                  <ButtonGroup variant="contained" size="small">
                                    <Button
                                      disabled={i.cartQty === 1}
                                      onClick={() =>
                                        this.handleToggle(i, key, "-")
                                      }
                                    >
                                      -
                                    </Button>
                                    <div
                                      style={{
                                        width: 30,
                                        fontSize: 20,
                                        textAlign: "center",
                                      }}
                                    >
                                      {i.cartQty}
                                    </div>
                                    <Button
                                      onClick={() =>
                                        this.handleToggle(i, key, "+")
                                      }
                                    >
                                      +
                                    </Button>
                                  </ButtonGroup>
                                </div>
                              </Grid>
                            </Grid>
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </scrollable-component>
                </div>
                <div style={{ height: 150, backgroundColor: "lightgray" }}>
                  <Grid container spacing={0}>
                    <Grid xs style={{ paddingLeft: 20 }}>
                      <div
                        style={{
                          marginTop: 30,
                          fontSize: 18,
                        }}
                      >
                        Total Items:
                      </div>
                      <div
                        style={{
                          fontSize: 18,
                        }}
                      >
                        Total Amount:
                      </div>
                    </Grid>
                    <Grid xs style={{ paddingRight: 20 }}>
                      <div style={{ float: "right" }}>
                        <div
                          style={{
                            marginTop: 30,
                            fontSize: 18,
                            textAlign: "end",
                            color: "red",
                            fontWeight: "bold",
                          }}
                        >
                          {totalCart}
                        </div>
                        <div
                          style={{
                            fontSize: 18,
                            textAlign: "end",
                            color: "red",
                            fontWeight: "bold",
                          }}
                        >
                          &#8369;{totalAmount.toFixed(2)}
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                  <div style={{ textAlign: "center" }}>
                    <Button
                      style={{
                        textTransform: "none",
                        background: "#8feb34",
                        color: "black",
                        marginTop: 10,
                        width: 270,
                      }}
                      onClick={() => this.handleCheckout()}
                    >
                      Checkout
                    </Button>
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

export default ShoppingComp;
